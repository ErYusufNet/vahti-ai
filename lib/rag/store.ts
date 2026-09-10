/**
 * Görev 7 — tietopankin varasto (DB) + siemennys + uudelleenindeksointi.
 * Ilman DB:tä kaikki operaatiot degradoivat mock-tietopankkiin (vain luku).
 */
import { withDb, isDbAvailable } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { knowledgeBase as MOCK_KB, clinic as MOCK_CLINIC } from "@/lib/mock/data";
import { embed, isEmbeddingConfigured, toVectorLiteral } from "./embeddings";

export type KbRow = {
  id: string;
  palvelu: string;
  kategoria: string;
  hinta: string;
  kesto: string;
  tiedot: string;
  embedded?: boolean;
};

/** Varmistaa, että klinikka on olemassa; palauttaa sen id:n (tai null ilman DB:tä). */
async function ensureKlinikId(): Promise<string | null> {
  return withDb(
    async (db) => {
      const existing = await db.klinik.findFirst();
      if (existing) return existing.id;
      const created = await db.klinik.create({
        data: {
          ad: MOCK_CLINIC.ad,
          email: MOCK_CLINIC.email,
          telefon: MOCK_CLINIC.telefon,
          sehir: MOCK_CLINIC.sehir,
          ulke: MOCK_CLINIC.ulke,
          sektor: MOCK_CLINIC.sektor,
        },
      });
      return created.id;
    },
    null,
    "ensureKlinik",
  );
}

/** Listaa tietopankin. `q` = valinnainen tekstisuodatin. */
export async function listKnowledge(q?: string): Promise<{ rows: KbRow[]; backend: "db" | "mock" }> {
  if (!(await isDbAvailable())) {
    const rows = MOCK_KB.filter(
      (e) =>
        !q ||
        `${e.palvelu} ${e.kategoria} ${e.tiedot}`.toLowerCase().includes(q.toLowerCase()),
    ).map((e) => ({ ...e, embedded: false }));
    return { rows, backend: "mock" };
  }

  const rows = await withDb<KbRow[]>(
    async (db) => {
      const list = await db.knowledgeEntry.findMany({
        where: q
          ? {
              OR: [
                { palvelu: { contains: q, mode: "insensitive" } },
                { kategoria: { contains: q, mode: "insensitive" } },
                { tiedot: { contains: q, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "asc" },
      });
      // Onko embedding laskettu?
      const withEmb = await db.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM "KnowledgeEntry" WHERE embedding IS NOT NULL`,
      );
      const embSet = new Set(withEmb.map((r) => r.id));
      return list.map((r) => ({
        id: r.id,
        palvelu: r.palvelu,
        kategoria: r.kategoria,
        hinta: r.hinta,
        kesto: r.kesto,
        tiedot: r.tiedot,
        embedded: embSet.has(r.id),
      }));
    },
    [],
    "listKnowledge",
  );
  return { rows, backend: "db" };
}

export type KbInput = {
  palvelu: string;
  kategoria: string;
  hinta?: string;
  kesto?: string;
  tiedot: string;
};

/** Lisää tietue + laskee embeddingin heti jos avain on. Ilman DB:tä palauttaa virheen. */
export async function addKnowledge(
  input: KbInput,
): Promise<{ ok: boolean; id?: string; embedded: boolean; error?: string }> {
  if (!(await isDbAvailable())) {
    return {
      ok: false,
      embedded: false,
      error: "Tietokanta ei ole käytettävissä — lisääminen vaatii DATABASE_URL:n ja aja `npm run db:push`.",
    };
  }
  const klinikId = await ensureKlinikId();
  if (!klinikId) return { ok: false, embedded: false, error: "Klinikkaa ei voitu luoda." };

  const created = await prisma.knowledgeEntry.create({
    data: {
      klinikId,
      palvelu: input.palvelu,
      kategoria: input.kategoria,
      hinta: input.hinta ?? "",
      kesto: input.kesto ?? "",
      tiedot: input.tiedot,
    },
  });

  let embedded = false;
  if (isEmbeddingConfigured()) {
    try {
      const vec = toVectorLiteral(
        await embed(`${input.palvelu}. ${input.kategoria}. ${input.tiedot}`),
      );
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeEntry" SET embedding = '${vec}'::vector WHERE id = $1`,
        created.id,
      );
      embedded = true;
    } catch (err) {
      console.warn("[rag] embeddingin laskenta epäonnistui:", err);
    }
  }
  return { ok: true, id: created.id, embedded };
}

/**
 * Siementää mock-tietopankin DB:hen (jos tyhjä) ja laskee embeddingit
 * kaikille tietueille, joilta se puuttuu.
 */
export async function reindexKnowledge(): Promise<{
  ok: boolean;
  seeded: number;
  embedded: number;
  skipped: number;
  note?: string;
}> {
  if (!(await isDbAvailable())) {
    return {
      ok: false,
      seeded: 0,
      embedded: 0,
      skipped: 0,
      note: "Tietokanta ei ole käytettävissä. Aseta DATABASE_URL ja aja `npm run db:push`.",
    };
  }
  const klinikId = await ensureKlinikId();
  if (!klinikId) return { ok: false, seeded: 0, embedded: 0, skipped: 0, note: "Ei klinikkaa." };

  // 1) Siemennys
  let seeded = 0;
  const count = await prisma.knowledgeEntry.count({ where: { klinikId } });
  if (count === 0) {
    for (const e of MOCK_KB) {
      await prisma.knowledgeEntry.create({
        data: {
          klinikId,
          palvelu: e.palvelu,
          kategoria: e.kategoria,
          hinta: e.hinta,
          kesto: e.kesto,
          tiedot: e.tiedot,
        },
      });
      seeded++;
    }
  }

  // 2) Embeddingit puuttuville
  let embedded = 0;
  let skipped = 0;
  if (!isEmbeddingConfigured()) {
    skipped = await prisma.knowledgeEntry.count({ where: { klinikId } });
    return {
      ok: true,
      seeded,
      embedded: 0,
      skipped,
      note: "Embedding-avain puuttuu (OPENAI_API_KEY / VOYAGE_API_KEY) — haku toimii avainsanoilla.",
    };
  }

  const missing = await prisma.$queryRawUnsafe<{ id: string; palvelu: string; kategoria: string; tiedot: string }[]>(
    `SELECT id, palvelu, kategoria, tiedot FROM "KnowledgeEntry"
     WHERE "klinikId" = $1 AND embedding IS NULL`,
    klinikId,
  );
  for (const row of missing) {
    try {
      const vec = toVectorLiteral(await embed(`${row.palvelu}. ${row.kategoria}. ${row.tiedot}`));
      await prisma.$executeRawUnsafe(
        `UPDATE "KnowledgeEntry" SET embedding = '${vec}'::vector WHERE id = $1`,
        row.id,
      );
      embedded++;
    } catch (err) {
      console.warn(`[rag] embedding epäonnistui (${row.id}):`, err);
      skipped++;
    }
  }
  return { ok: true, seeded, embedded, skipped };
}
