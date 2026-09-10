import { NextResponse } from "next/server";
import { runWorkflow } from "@/lib/workflows/runner";
import { getWorkflowDef } from "@/lib/workflows/definitions";

/**
 * Görev 8 — POST /api/workflows/:id/run
 * Body / query:  ?dryRun=true  → laskee osumat, ei lähetä.
 *                (oletus)      → suorittaa oikeasti (lähettää jos avaimet + DB).
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getWorkflowDef(id)) {
    return NextResponse.json({ error: "Työnkulkua ei löytynyt" }, { status: 404 });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "true";
  const result = await runWorkflow(id, { dryRun });
  return NextResponse.json(result);
}
