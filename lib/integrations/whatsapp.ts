/**
 * Görev 5 — WhatsApp Business Cloud API (OIKEA API).
 *
 * Lähetys: POST https://graph.facebook.com/<versio>/<PHONE_ID>/messages
 * Ilman `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_ID` -avaimia lähetys kirjataan
 * konsoliin eikä oikeaa viestiä lähetetä ("anahtar yok" -modu).
 */
import crypto from "node:crypto";
import { env } from "@/lib/env";

export function isWhatsAppConfigured(): boolean {
  return !!(env.whatsappToken() && env.whatsappPhoneId());
}

export type SendResult = { mode: "live" | "mock"; id?: string };

export async function sendWhatsAppText(
  to: string,
  body: string,
): Promise<SendResult> {
  if (!isWhatsAppConfigured()) {
    console.warn(
      `[whatsapp] WHATSAPP_TOKEN/PHONE_ID puuttuu — vastausta EI lähetetty numeroon ${to}.\n  → ${body}`,
    );
    return { mode: "mock" };
  }

  const url = `https://graph.facebook.com/${env.whatsappApiVersion()}/${env.whatsappPhoneId()}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.whatsappToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 4096) },
    }),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp send -virhe ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { messages?: { id: string }[] };
  return { mode: "live", id: data.messages?.[0]?.id };
}

/**
 * Meta allekirjoittaa webhookit `X-Hub-Signature-256`-otsakkeella sovelluksen
 * salaisuudella. Jos `WHATSAPP_APP_SECRET` on asetettu, tarkistetaan; muuten
 * ohitetaan (kehitys).
 */
export function verifyWhatsAppSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET?.trim();
  if (!secret) return true; // ei salaisuutta → ei tarkistusta (kehitys)
  if (!signature) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Poimii ensimmäisen tekstiviestin Metan webhook-rungosta. */
export function parseInboundMessage(body: unknown): {
  from: string;
  name?: string;
  text: string;
  waMessageId?: string;
} | null {
  const value =
    // @ts-expect-error — Metan rakenne on löyhä
    body?.entry?.[0]?.changes?.[0]?.value;
  const msg = value?.messages?.[0];
  if (!msg || msg.type !== "text" || !msg.text?.body) return null;
  return {
    from: msg.from,
    name: value?.contacts?.[0]?.profile?.name,
    text: msg.text.body,
    waMessageId: msg.id,
  };
}
