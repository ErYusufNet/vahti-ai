import { NextResponse } from "next/server";
import { evaluateWorkflow, getWorkflow } from "@/lib/workflows/engine";

/**
 * Görev 8 — POST /api/workflows/:id/run
 * Ajaa työnkulun KUIVAHARJOITUKSENA: laskee kohdeliidit, ei lähetä viestejä.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const wf = getWorkflow(id);
  if (!wf) {
    return NextResponse.json({ error: "Työnkulkua ei löytynyt" }, { status: 404 });
  }
  return NextResponse.json(evaluateWorkflow(wf));
}
