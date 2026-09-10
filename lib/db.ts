import { prisma } from "./prisma";
import { env } from "./env";

/**
 * Tietokannan saatavuuden tunnistus. Ilman toimivaa PostgreSQL-yhteyttä
 * (esim. DATABASE_URL puuttuu tai palvelin ei ole pystyssä) sovellus jatkaa
 * mock-datalla eikä kaadu.
 */
let cached: { ok: boolean; checkedAt: number } | null = null;
const TTL = 30_000;

export async function isDbAvailable(): Promise<boolean> {
  if (!env.databaseUrl()) return false;
  if (cached && Date.now() - cached.checkedAt < TTL) return cached.ok;
  try {
    await prisma.$queryRaw`SELECT 1`;
    cached = { ok: true, checkedAt: Date.now() };
  } catch {
    cached = { ok: false, checkedAt: Date.now() };
  }
  return cached.ok;
}

/**
 * Aja tietokantatoiminto turvallisesti. Jos DB ei ole käytettävissä tai kysely
 * heittää, palautetaan `fallback` ja kirjataan varoitus.
 */
export async function withDb<T>(
  fn: (db: typeof prisma) => Promise<T>,
  fallback: T,
  label = "db",
): Promise<T> {
  if (!(await isDbAvailable())) return fallback;
  try {
    return await fn(prisma);
  } catch (err) {
    console.warn(`[db:${label}] kysely epäonnistui, käytetään fallbackia:`, err);
    return fallback;
  }
}

export { prisma };
