import { NextResponse } from "next/server";
import { newVoiceResponse, speak, collectInput } from "@/lib/voice/twiml";
import { validateTwilioSignature, isTwilioConfigured } from "@/lib/voice/twilio";
import { isDeepgramConfigured } from "@/lib/voice/stt";
import { isElevenLabsConfigured } from "@/lib/voice/tts";
import { anthropicKey } from "@/lib/env";

/**
 * Görev 9 — Twilio-puhelun webhook (Voice URL).
 *
 * POST: Twilio kutsuu tätä saapuvalle puhelulle → palautetaan TwiML:
 *   tervehdys + syötteen keräys (Deepgram <Record> tai Twilio <Gather>).
 * GET:  ihmisluettava tila (mitkä avaimet on kytketty).
 *
 * Ilman avaimia endpoint palauttaa validia TwiML:ää eikä kaadu; oikeaa
 * puhelua ei kuitenkaan voi vastaanottaa ilman Twilio-numeroa + julkista URLia.
 */

export async function GET() {
  return NextResponse.json({
    endpoint: "POST tämä osoite Twilion numeron 'A CALL COMES IN' -webhookiin",
    tila: {
      twilio: isTwilioConfigured(),
      deepgram_stt: isDeepgramConfigured(),
      elevenlabs_tts: isElevenLabsConfigured(),
      claude: !!anthropicKey(),
    },
    virta: isDeepgramConfigured()
      ? "tervehdys → <Record> → Deepgram STT → Claude → ElevenLabs/Say → toisto"
      : "tervehdys → <Gather input=speech> (Twilion STT) → Claude → ElevenLabs/Say → toisto",
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
  collectInput(vr, { deepgram: isDeepgramConfigured(), language: "fi" });

  return new NextResponse(vr.toString(), {
    headers: { "content-type": "text/xml" },
  });
}
