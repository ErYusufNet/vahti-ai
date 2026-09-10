/**
 * GÖREV A + E — yhteydenottopyyntöjen luonti + listaus + round-robin -jako.
 * Toimii sekä tietokannan kanssa (CallbackRequest-taulu) että ilman
 * (lib/callbacks-store.ts muistivarasto).
 */
import { withDb, isDbAvailable } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { clinic as MOCK_CLINIC, users as MOCK_USERS } from "@/lib/mock/data";
import { memAdd, memCount, memList, type CallbackRow } from "./callbacks-store";

export type CreateCallbackInput = {
  nimi: string;
  email?: string;
  puhelin?: string;
  aihe?: string;
  viesti: string;
  tapa?: "teksti" | "aani";
  lahde?: "widget" | "call-link";
  slug?: string;
};

/** Round-robin: seuraava tiimin jäsen (DB tai mock). */
async function pickAssignee(
  klinikId: string,
): Promise<{ id: string | null; nimi: string | null }> {
  if (await isDbAvailable()) {
    return withDb(
      async (db) => {
        const team = await db.kullanici.findMany({
          where: { klinikId },
          orderBy: { createdAt: "asc" },
        });
        if (team.length === 0) return { id: null, nimi: null };
        const count = await db.callbackRequest.count({ where: { klinikId } });
        const m = team[count % team.length];
        return { id: m.id, nimi: m.ad };
      },
      { id: null, nimi: null },
      "pickAssignee",
    );
  }
  const m = MOCK_USERS[memCount() % MOCK_USERS.length];
  return { id: m.id, nimi: m.ad };
}

export async function createCallbackRequest(input: CreateCallbackInput): Promise<{
  ok: boolean;
  id: string;
  assignedTo: string | null;
  backend: "db" | "mock";
}> {
  if (await isDbAvailable()) {
    const res = await withDb(
      async (db) => {
        let klinik = input.slug
          ? await db.klinik.findUnique({ where: { slug: input.slug } })
          : null;
        klinik ??= await db.klinik.findFirst();
        klinik ??= await db.klinik.create({
          data: { ad: MOCK_CLINIC.ad, email: MOCK_CLINIC.email },
        });
        const assignee = await pickAssignee(klinik.id);
        const row = await db.callbackRequest.create({
          data: {
            klinikId: klinik.id,
            nimi: input.nimi,
            email: input.email || null,
            puhelin: input.puhelin || null,
            aihe: input.aihe || null,
            viesti: input.viesti,
            tapa: input.tapa ?? "teksti",
            lahde: input.lahde ?? "widget",
            assignedToId: assignee.id,
            assignedToNimi: assignee.nimi,
          },
        });
        return {
          ok: true,
          id: row.id,
          assignedTo: assignee.nimi,
          backend: "db" as const,
        };
      },
      null,
      "createCallback",
    );
    if (res) return res;
  }

  const assignee = await pickAssignee("demo");
  const row: CallbackRow = {
    id: `cb_${Math.random().toString(36).slice(2, 10)}`,
    klinikId: "demo",
    nimi: input.nimi,
    email: input.email || null,
    puhelin: input.puhelin || null,
    aihe: input.aihe || null,
    viesti: input.viesti,
    tapa: input.tapa ?? "teksti",
    lahde: input.lahde ?? "widget",
    tila: "uusi",
    assignedToId: assignee.id,
    assignedToNimi: assignee.nimi,
    createdAt: new Date().toISOString(),
  };
  memAdd(row);
  return { ok: true, id: row.id, assignedTo: assignee.nimi, backend: "mock" };
}

export async function listCallbackRequests(): Promise<{
  rows: CallbackRow[];
  backend: "db" | "mock";
}> {
  if (await isDbAvailable()) {
    const rows = await withDb<CallbackRow[]>(
      async (db) => {
        const list = await db.callbackRequest.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        });
        return list.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }));
      },
      [],
      "listCallbacks",
    );
    return { rows, backend: "db" };
  }
  return { rows: memList(), backend: "mock" };
}

/** GÖREV E — montako callback-pyyntöä on jaettu kullekin tiimin jäsenelle (nimi → lkm). */
export async function assigneeCounts(): Promise<Record<string, number>> {
  const { rows } = await listCallbackRequests();
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.assignedToNimi) {
      counts[r.assignedToNimi] = (counts[r.assignedToNimi] ?? 0) + 1;
    }
  }
  return counts;
}

/** GÖREV C — PSTN-varayhteys: klinikan varanumero (DB tai mock). */
export async function getBackupNumber(slug?: string): Promise<string | null> {
  if (await isDbAvailable()) {
    return withDb(
      async (db) => {
        const k = slug
          ? await db.klinik.findUnique({ where: { slug } })
          : await db.klinik.findFirst();
        return k?.varayhteysNumero ?? null;
      },
      MOCK_CLINIC.varayhteysNumero,
      "getBackupNumber",
    );
  }
  return MOCK_CLINIC.varayhteysNumero;
}

/** Ratkaisee klinikan nimen slugilla (call-linkkiä varten). */
export async function getClinicBySlug(
  slug: string,
): Promise<{ ad: string; slug: string; varayhteysNumero: string | null } | null> {
  if (slug === MOCK_CLINIC.slug) {
    return {
      ad: MOCK_CLINIC.ad,
      slug: MOCK_CLINIC.slug,
      varayhteysNumero: MOCK_CLINIC.varayhteysNumero,
    };
  }
  if (!(await isDbAvailable())) return null;
  return withDb(
    async (db) => {
      const k = await db.klinik.findUnique({ where: { slug } });
      return k
        ? { ad: k.ad, slug: k.slug ?? slug, varayhteysNumero: k.varayhteysNumero }
        : null;
    },
    null,
    "getClinicBySlug",
  );
}

export { prisma };
