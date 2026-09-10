import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/claude";

/**
 * Görev 5 — WhatsApp Business Cloud API -webhook (RUNKO).
 *
 * TODO (oikea integraatio): tarvitset Meta for Developers -sovelluksen ja
 * WhatsApp Business -numeron. Lisää `.env`-tiedostoon:
 *   WHATSAPP_VERIFY_TOKEN=oma-satunnainen-merkkijono   (webhookin vahvistus)
 *   WHATSAPP_ACCESS_TOKEN=EAAG...                      (Graph API -token)
 *   WHATSAPP_PHONE_NUMBER_ID=1234567890
 * Hae ne: https://developers.facebook.com → luo sovellus → lisää "WhatsApp"
 * -tuote → Webhooks-välilehti. Aseta webhook-URL:ksi
 *   https://<domain>/api/whatsapp   ja verify token yllä olevaksi.
 *
 * Tila nyt:
 *  - GET  : webhookin vahvistus (toimii heti kun VERIFY_TOKEN on asetettu)
 *  - POST : jäsentää saapuvan viestin, ajaa agentin, mutta EI lähetä vastausta
 *           takaisin ilman WHATSAPP_ACCESS_TOKENia — vastaus vain lokitetaan.
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // Meta-webhookin viestirakenne (yksinkertaistettu).
  const msg =
    body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ??
    body?.message ?? // helpottaa manuaalista testausta
    null;
  const from =
    body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ?? "tuntematon";

  if (!msg) {
    // Meta odottaa aina 200-vastausta, muuten se yrittää uudelleen.
    return NextResponse.json({ ok: true, skipped: "ei tekstiviestiä" });
  }

  const result = await runAgent([{ role: "user", content: String(msg) }]);

  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    // TODO: lähetä vastaus Graph API:lla:
    // await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {...})
    console.log(`[whatsapp] (TODO) lähettäisi vastauksen numeroon ${from}`);
  } else {
    console.log(`[whatsapp] (mock) vastaus numerolle ${from}:`, result.reply);
  }

  // TODO (Görev 5): tallenna keskustelu tietokantaan (Prisma: Konusma).
  return NextResponse.json({ ok: true, mode: result.mode, reply: result.reply });
}
