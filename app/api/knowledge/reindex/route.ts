import { NextResponse } from "next/server";
import { reindexKnowledge } from "@/lib/rag/store";

/**
 * Görev 7 — POST /api/knowledge/reindex
 * Siementää mock-tietopankin tietokantaan (jos tyhjä) ja laskee embeddingit
 * kaikille tietueille, joilta ne puuttuvat. Ilman DB:tä palauttaa selityksen.
 */
export async function POST() {
  return NextResponse.json(await reindexKnowledge());
}
