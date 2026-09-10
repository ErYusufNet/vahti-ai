import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/claude";
import { appendConversationTurn } from "@/lib/conversations";
import {
  parseInboundMessage,
  sendWhatsAppText,
  verifyWhatsAppSignature,
  isWhatsAppConfigured,
} from "@/lib/integrations/whatsapp";
import { env } from "@/lib/env";

/**
 * Görev 5 — WhatsApp Business Cloud API -webhook.
 *
 * GET  : Metan webhook-vahvistus (hub.verify_token === WHATSAPP_VERIFY_TOKEN)
 * POST : saapuva viesti → Claude-agentti → vastaus takaisin WhatsAppiin →
 *        keskustelu talteen tietokantaan.
 *
 * "Anahtar yok" -modu:
 *  - GET vahvistus toimii heti kun WHATSAPP_VERIFY_TOKEN on asetettu.
 *  - POST ajaa agentin (mock-vastaus jos ei ANTHROPIC_API_KEY:tä), mutta
 *    vastausta ei lähetetä WhatsAppiin ilman WHATSAPP_TOKEN/PHONE_ID:tä —
 *    se vain kirjataan. Vastauksen JSON kertoo `delivery`-tilan.
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = env.whatsappVerifyToken();

  if (!expected) {
    return NextResponse.json(
      { error: "WHATSAPP_VERIFY_TOKEN ei ole asetettu .env-tiedostossa" },
      { status: 503 },
    );
  }
  if (mode === "subscribe" && token === expected) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWhatsAppSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true, skipped: "ei JSON" });
  }

  const inbound = parseInboundMessage(body);
  // Meta odottaa aina 200:aa (muuten uudelleenyritys) — myös statuspäivityksille.
  if (!inbound) {
    return NextResponse.json({ ok: true, skipped: "ei tekstiviestiä" });
  }

  // 1) Agentti
  const result = await runAgent([{ role: "user", content: inbound.text }]);

  // 2) Vastaus takaisin WhatsAppiin (tai loki jos avain puuttuu)
  let delivery: { mode: string; id?: string; error?: string };
  try {
    delivery = await sendWhatsAppText(inbound.from, result.reply);
  } catch (err) {
    delivery = { mode: "error", error: String(err) };
  }

  // 3) Talteen tietokantaan (no-op ilman DB:tä)
  const stored = await appendConversationTurn({
    channel: "whatsapp",
    contact: inbound.from,
    name: inbound.name,
    lang: result.language,
    userText: inbound.text,
    aiText: result.reply,
  });

  return NextResponse.json({
    ok: true,
    agent: result.mode, // "live" | "mock"
    delivery: delivery.mode, // "live" | "mock" | "error"
    persisted: stored.saved,
    whatsappConfigured: isWhatsAppConfigured(),
    reply: result.reply,
  });
}
