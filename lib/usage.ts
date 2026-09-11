/**
 * GÖREV C — käyttö-/kustannusseuranta.
 *
 * Jokainen ääni-, WhatsApp- tai chat-vuoro kirjataan "usage_logs"-tauluun
 * (Prisma-mallina `UsageLog`) `logUsage()`-funktiolla. `getMonthlyUsage()`
 * laskee kuluvan kalenterikuukauden summat ja verrannon paketin kiintiöön
 * (lib/pricing.ts → PLAN_LIMITS).
 *
 * Ilman tietokantaa (DATABASE_URL puuttuu) `logUsage` on no-op ja
 * `getMonthlyUsage` palauttaa demo-lukuja, jotta Asetukset → Käyttö -välilehti
 * ja 80 %:n varoitusbanneri voi näkyä myös demo-tilassa eikä sovellus kaadu.
 */
import { withDb, isDbAvailable } from "@/lib/db";
import { clinic as MOCK_CLINIC } from "@/lib/mock/data";
import { PLAN_LIMITS, type PlanId } from "@/lib/pricing";

export type UsageType = "ses" | "whatsapp" | "chat";

function monthStart(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function toPlanId(label: string | undefined | null): PlanId {
  const v = (label ?? "essential").toLowerCase();
  return (v in PLAN_LIMITS ? v : "essential") as PlanId;
}

/**
 * Kirjaa yhden käyttötapahtuman.
 * `miktar`: minuutit ("ses") tai kappalemäärä ("whatsapp" | "chat").
 * No-op ilman tietokantaa — ei koskaan heitä kutsujalle.
 */
export async function logUsage(tip: UsageType, miktar: number): Promise<void> {
  if (!(miktar > 0)) return;
  await withDb(
    async (db) => {
      let klinik = await db.klinik.findFirst();
      klinik ??= await db.klinik.create({
        data: { ad: MOCK_CLINIC.ad, email: MOCK_CLINIC.email },
      });
      await db.usageLog.create({ data: { klinikId: klinik.id, tip, miktar } });
    },
    undefined,
    "logUsage",
  );
}

export type MonthlyUsage = {
  plan: PlanId;
  voiceMinutes: number;
  whatsappMessages: number;
  voiceLimit: number | null; // null = rajaton (Enterprise)
  whatsappLimit: number | null;
  voicePct: number | null; // null = rajaton, ei prosenttia
  whatsappPct: number | null;
  backend: "db" | "mock";
};

function toUsage(
  plan: PlanId,
  voiceMinutes: number,
  whatsappMessages: number,
  backend: "db" | "mock",
): MonthlyUsage {
  const limits = PLAN_LIMITS[plan];
  const pct = (used: number, limit: number | null) =>
    limit ? Math.min(999, Math.round((used / limit) * 100)) : null;
  return {
    plan,
    voiceMinutes: Math.round(voiceMinutes * 10) / 10,
    whatsappMessages: Math.round(whatsappMessages),
    voiceLimit: limits.voiceMinutes,
    whatsappLimit: limits.whatsappMessages,
    voicePct: pct(voiceMinutes, limits.voiceMinutes),
    whatsappPct: pct(whatsappMessages, limits.whatsappMessages),
    backend,
  };
}

/** Kuluvan kuukauden käyttö + prosenttiosuus klinikan paketin kiintiöstä. */
export async function getMonthlyUsage(): Promise<MonthlyUsage> {
  const mockPlan = toPlanId(MOCK_CLINIC.plan);

  if (await isDbAvailable()) {
    const fromDb = await withDb(
      async (db) => {
        const klinik = await db.klinik.findFirst();
        if (!klinik) return null;
        const rows = await db.usageLog.groupBy({
          by: ["tip"],
          where: { klinikId: klinik.id, tarih: { gte: monthStart() } },
          _sum: { miktar: true },
        });
        const ses = rows.find((r) => r.tip === "ses")?._sum.miktar ?? 0;
        const whatsapp = rows.find((r) => r.tip === "whatsapp")?._sum.miktar ?? 0;
        return toUsage(toPlanId(klinik.plan), ses, whatsapp, "db" as const);
      },
      null,
      "getMonthlyUsage",
    );
    if (fromDb) return fromDb;
  }

  // Demo-luvut ilman tietokantaa: ~42 %/86 % kiintiöstä, jotta 80 %:n
  // varoitusbanneri on nähtävissä myös ilman DATABASE_URL:ia.
  const limits = PLAN_LIMITS[mockPlan];
  return toUsage(
    mockPlan,
    Math.round((limits.voiceMinutes ?? 0) * 0.42 * 10) / 10,
    Math.round((limits.whatsappMessages ?? 0) * 0.86),
    "mock",
  );
}

/** Onko jompikumpi kiintiö saavuttanut kynnysarvon (oletus 80 %)? */
export function isNearLimit(u: MonthlyUsage, threshold = 80): boolean {
  return (u.voicePct ?? 0) >= threshold || (u.whatsappPct ?? 0) >= threshold;
}
