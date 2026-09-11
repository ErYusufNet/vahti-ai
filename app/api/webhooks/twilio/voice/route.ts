import { NextResponse } from "next/server";
import { newVoiceResponse, speak, collectInput } from "@/lib/voice/twiml";
import { validateTwilioSignature, isTwilioConfigured } from "@/lib/voice/twilio";
import { isSonioxSttConfigured } from "@/lib/voice/soniox-stt";
import { isSonioxTtsConfigured } from "@/lib/voice/soniox-tts";
import { anthropicKey } from "@/lib/env";

/**
 * Görev 9 — Twilio-puhelun webhook (Voice URL).
 *
 * POST: Twilio kutsuu tätä saapuvalle puhelulle → palautetaan TwiML:
 *   tervehdys + syötteen keräys (Soniox <Record> tai Twilio <Gather>).
 * GET:  ihmisluettava tila (mitkä avaimet on kytketty).
 *
 * Ilman avaimia endpoint palauttaa validia TwiML:ää eikä kaadu; oikeaa
 * puhelua ei kuitenkaan voi vastaanottaa ilman Twilio-numeroa + julkista URLia.
 * Ilman SONIOX_API_KEY:tä puhelu jatkuu silti Twilion omalla <Gather>/<Say>-
 * parilla — "Ääni-AI ei ole vielä yhdistetty, jatka keskustelua chatissa"
 * näkyy Asetuksissa ja GET /api/integrations:issa (ei kaadu).
 */

export async function GET() {
  const soniox = isSonioxSttConfigured() && isSonioxTtsConfigured();
  return NextResponse.json({
    endpoint: "POST tämä osoite Twilion numeron 'A CALL COMES IN' -webhookiin",
    tila: {
      twilio: isTwilioConfigured(),
      soniox_stt: isSonioxSttConfigured(),
      soniox_tts: isSonioxTtsConfigured(),
      claude: !!anthropicKey(),
    },
    virta: soniox
      ? "tervehdys → <Record> → Soniox STT → Claude → Soniox TTS/Say → toisto"
      : "tervehdys → <Gather input=speech> (Twilion STT) → Claude → Twilion <Say> → toisto",
    huomautus: soniox
      ? undefined
      : "Ses hizmeti yapılandırılmadı (SONIOX_API_KEY puuttuu) — chat-tilassa jatketaan Twilion oman puheentunnistuksen ja äänen avulla.",
  });
}

export async function POST(req: Request) {
  const url = req.url;
  const form = await req.formData();
  const params = Object.fromEntries(
    [...form.entries()].map(([k, v]) => [k, String(v)]),
  );

  if (!validateTwilioSignature(req.headers.get("x-twilio-signature"), url, params)) {
    return new NextResponse("Invalid Twilio signature", { status: 403 });
  }

  const vr = newVoiceResponse();
  await speak(
    vr,
    "Hei, tässä on Hammasklinikka Auroran tekoälyvastaanotto. Kuinka voin auttaa?",
    "fi",
  );
  collectInput(vr, { soniox: isSonioxSttConfigured(), language: "fi" });

  return new NextResponse(vr.toString(), {
    headers: { "content-type": "text/xml" },
  });
}
