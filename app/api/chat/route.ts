import { NextResponse } from "next/server";
import { runAgent, type ChatMsg } from "@/lib/agent/claude";

/**
 * Görev 2 — POST /api/chat
 *
 * Body:  { "message": "..." }   tai   { "messages": [{ role, content }, ...] }
 * Vastaa Claudella (Sonnet 5) + mock-työkalu "randevu_olustur".
 * Ilman ANTHROPIC_API_KEY:tä toimii mock-tilassa (mode: "mock").
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Virheellinen JSON" }, { status: 400 });
  }

  const b = (body ?? {}) as { message?: unknown; messages?: unknown };
  let messages: ChatMsg[];

  if (typeof b.message === "string" && b.message.trim()) {
    messages = [{ role: "user", content: b.message.trim() }];
  } else if (Array.isArray(b.messages) && b.messages.length > 0) {
    messages = (b.messages as ChatMsg[]).filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    );
    if (messages.length === 0 || messages[0].role !== "user") {
      return NextResponse.json(
        { error: "messages[]: ensimmäisen viestin on oltava 'user'" },
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Kenttä 'message' tai 'messages' vaaditaan" },
      { status: 400 },
    );
  }

  try {
    const result = await runAgent(messages);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/chat] virhe:", err);
    return NextResponse.json(
      { error: "Agentti epäonnistui", detail: String(err) },
      { status: 502 },
    );
  }
}
