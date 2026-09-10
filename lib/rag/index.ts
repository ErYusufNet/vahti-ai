/**
 * Görev 7 — RAG-haku.
 *
 * Kolme tasoa, valitaan sen mukaan mikä on käytettävissä:
 *  1. DB + embedding-avain  → pgvector-kosinilähisyys ("<=>")   [paras]
 *  2. DB, ei embedding-avainta → SQL ILIKE -avainsanahaku
 *  3. Ei DB:tä               → mock-tietopankin avainsanahaku (lib/mock/data.ts)
 */
import { withDb, isDbAvailable } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { knowledgeBase as MOCK_KB, type KnowledgeEntry } from "@/lib/mock/data";
import { embed, isEmbeddingConfigured, toVectorLiteral } from "./embeddings";

export type KbHit = {
  id: string;
  palvelu: string;
  kategoria: string;
  hinta: string;
  kesto: string;
  tiedot: string;
  score?: number;
  source: "vector" | "keyword-db" | "keyword-mock";
};

function keywordScoreMock(query: string, k: number): KbHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  return MOCK_KB.map((e: KnowledgeEntry) => {
    const hay = `${e.palvelu} ${e.kategoria} ${e.tiedot}`.toLowerCase();
    const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { e, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((x) => x.score > 0 || terms.length === 0)
    .map(({ e, score }) => ({
      id: e.id,
      palvelu: e.palvelu,
      kategoria: e.kategoria,
      hinta: e.hinta,
      kesto: e.kesto,
      tiedot: e.tiedot,
      score,
      source: "keyword-mock" as const,
    }));
}

/** Hae `k` osuvinta tietopankin tietuetta. Ei koskaan heitä — degradoi tasolta toiselle. */
export async function retrieveRelevant(query: string, k = 5): Promise<KbHit[]> {
  if (!(await isDbAvailable())) {
    return keywordScoreMock(query, k);
  }

  // Taso 1: vektorihaku
  if (isEmbeddingConfigured()) {
    try {
      const vec = toVectorLiteral(await embed(query));
      const rows = await prisma.$queryRawUnsafe<
        {
          id: string;
          palvelu: string;
          kategoria: string;
          hinta: string;
          kesto: string;
          tiedot: string;
          score: number;
        }[]
      >(
        `SELECT id, palvelu, kategoria, hinta, kesto, tiedot,
                1 - (embedding <=> '${vec}'::vector) AS score
         FROM "KnowledgeEntry"
         WHERE embedding IS NOT NULL
         ORDER BY embedding <=> '${vec}'::vector
         LIMIT ${Math.max(1, Math.min(k, 20))}`,
      );
      if (rows.length > 0) {
        return rows.map((r) => ({ ...r, source: "vector" as const }));
      }
    } catch (err) {
      console.warn("[rag] vektorihaku epäonnistui, kokeillaan avainsanahakua:", err);
    }
  }

  // Taso 2: DB-avainsanahaku
  const dbHits = await withDb<KbHit[]>(
    async (db) => {
      const rows = await db.knowledgeEntry.findMany({
        where: {
          OR: query
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 2)
            .map((w) => ({ tiedot: { contains: w, mode: "insensitive" as const } })),
        },
        take: k,
      });
      return rows.map((r) => ({
        id: r.id,
        palvelu: r.palvelu,
        kategoria: r.kategoria,
        hinta: r.hinta,
        kesto: r.kesto,
        tiedot: r.tiedot,
        source: "keyword-db" as const,
      }));
    },
    [],
    "rag-keyword",
  );

  return dbHits.length > 0 ? dbHits : keywordScoreMock(query, k);
}
