import { NextResponse } from "next/server";
import { listKnowledge, addKnowledge } from "@/lib/rag/store";
import { integrationStatus } from "@/lib/env";
import { isDbAvailable } from "@/lib/db";

/**
 * Görev 7 — tietopankin rajapinta AI Asistan -sivulle.
 * GET  /api/knowledge?q=...   → lista (DB tai mock), hakusuodatin
 * POST /api/knowledge         → lisää tietue (vaatii DB:n) + laskee embeddingin
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? undefined;
  const { rows, backend } = await listKnowledge(q);
  return NextResponse.json({
    rows,
    backend, // "db" | "mock"
    dbAvailable: await isDbAvailable(),
    embeddings: integrationStatus().embeddings,
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const palvelu = typeof body.palvelu === "string" ? body.palvelu.trim() : "";
  const kategoria = typeof body.kategoria === "string" ? body.kategoria.trim() : "";
  const tiedot = typeof body.tiedot === "string" ? body.tiedot.trim() : "";
  if (!palvelu || !tiedot) {
    return NextResponse.json(
      { error: "palvelu ja tiedot ovat pakollisia" },
      { status: 400 },
    );
  }
  const res = await addKnowledge({
    palvelu,
    kategoria: kategoria || "Yleistieto",
    hinta: typeof body.hinta === "string" ? body.hinta : "",
    kesto: typeof body.kesto === "string" ? body.kesto : "",
    tiedot,
  });
  return NextResponse.json(res, { status: res.ok ? 201 : 422 });
}
