/**
 * Görev 7 — embedding-pipeline (OIKEA API).
 *
 * Suositus: OpenAI `text-embedding-3-small` (1536 ulottuvuutta) — halpa,
 * yleinen ja yhdellä avaimella. Anthropicilla ei ole omaa embedding-rajapintaa
 * (he suosittelevat Voyage AI:ta), joten Voyage on tuettu vaihtoehto
 * (`EMBEDDING_PROVIDER=voyage` + `VOYAGE_API_KEY`, malli `voyage-3` → 1024 dim,
 * mutta pgvector-sarake on 1536 → jos vaihdat Voyageen, päivitä myös
 * schema.prisman `vector(1536)` → `vector(1024)` ja aja migraatio).
 *
 * Ilman avainta: heittää MissingKeyError, jonka RAG-kerros nappaa ja siirtyy
 * avainsanahakuun.
 */
import { env, MissingKeyError } from "@/lib/env";

export const EMBEDDING_DIM = 1536;

export function isEmbeddingConfigured(): boolean {
  return env.embeddingProvider() === "voyage"
    ? !!env.voyageKey()
    : !!env.openaiKey();
}

export async function embed(text: string): Promise<number[]> {
  const provider = env.embeddingProvider();
  if (provider === "voyage") return embedVoyage(text);
  return embedOpenAI(text);
}

/** Batch — palauttaa embeddingit samassa järjestyksessä. */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const provider = env.embeddingProvider();
  const fn = provider === "voyage" ? embedVoyage : embedOpenAI;
  // Yksinkertaisuuden vuoksi peräkkäin; tuotannossa voi niputtaa.
  const out: number[][] = [];
  for (const t of texts) out.push(await fn(t));
  return out;
}

async function embedOpenAI(input: string): Promise<number[]> {
  const key = env.openaiKey();
  if (!key) throw new MissingKeyError("embeddings");
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "text-embedding-3-small", input }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI embeddings -virhe ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data[0].embedding;
}

async function embedVoyage(input: string): Promise<number[]> {
  const key = env.voyageKey();
  if (!key) throw new MissingKeyError("embeddings");
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "voyage-3", input, input_type: "document" }),
  });
  if (!res.ok) {
    throw new Error(`Voyage embeddings -virhe ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data[0].embedding;
}

/** pgvector-literaali number[]:stä (kaikki arvot numeroita → turvallinen). */
export function toVectorLiteral(vec: number[]): string {
  return `[${vec.map((n) => (Number.isFinite(n) ? n : 0)).join(",")}]`;
}
