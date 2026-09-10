/**
 * Görev 7 — RAG (Retrieval-Augmented Generation) RUNKO.
 *
 * TODO (oikea toteutus):
 *  1. Ota pgvector käyttöön Postgresissa:  CREATE EXTENSION IF NOT EXISTS vector;
 *     ja lisää Prisma-skeemaan taulu tietopankin paloille + vector-sarake
 *     (Prisma: `Unsupported("vector(1536)")` tai raakamigraatio).
 *  2. Embedding-malli: Voyage AI (Anthropic suosittelee) tai OpenAI.
 *     Lisää .env: VOYAGE_API_KEY=...  (https://www.voyageai.com/)
 *  3. chunkText() → embed() → tallenna. Haussa embed(kysymys) → vektori-
 *     lähimmät 3–5 palaa → liitä ne system-promptiin buildSystemPrompt():n
 *     koko tietopankin sijaan (ks. lib/agent/knowledge.ts).
 *
 * Tila nyt: yksinkertainen avainsanahaku mock-tietopankista, jotta rajapinta
 * on olemassa. Ei embeddingejä, ei vektorikantaa.
 */
import { knowledgeBase, type KnowledgeEntry } from "@/lib/mock/data";

export function chunkText(text: string, size = 400): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(" "));
  }
  return chunks;
}

/** TODO: korvaa oikealla embedding-kutsulla (Voyage/OpenAI). */
export async function embed(_text: string): Promise<number[]> {
  throw new Error("embed(): embedding-malli ei ole vielä kytketty (Görev 7).");
}

/** Väliaikainen avainsanahaku — palauttaa osuvimmat tietopankin tietueet. */
export function retrieveRelevant(query: string, k = 4): KnowledgeEntry[] {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = knowledgeBase.map((entry) => {
    const hay = `${entry.palvelu} ${entry.kategoria} ${entry.tiedot}`.toLowerCase();
    const score = terms.reduce((s, term) => s + (hay.includes(term) ? 1 : 0), 0);
    return { entry, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0)
    .map((s) => s.entry);
}
