import { NextResponse } from "next/server";
import { newVoiceResponse, speak, collectInput } from "@/lib/voice/twiml";
import { validateTwilioSignature } from "@/lib/voice/twilio";
import { handleVoiceTurn } from "@/lib/voice/pipeline";

/**
 * Görev 9 — Twilio <Gather input="speech"> -takaisinkutsu.
 * Käytössä kun DEEPGRAM_API_KEY puuttuu: Twilio litteroi puheen itse ja
 * antaa sen `SpeechResult`-parametrissa.
 */
export async function POST(req: Request) {
  const url = req.url;
  const form = await req.formData();
  const params = Object.fromEntries(
    [...form.entries()].map(([k, v]) => [k, String(v)]),
  );
  if (!validateTwilioSignature(req.headers.get("x-twilio-signature"), url, params)) {
    return new NextResponse("Invalid Twilio signature", { status: 403 });
  }

  const callSid = params.CallSid ?? "unknown";
  const from = params.From ?? "unknown";
  const transcript = (params.SpeechResult ?? "").trim();

  const vr = newVoiceResponse();

  if (!transcript) {
    await speak(vr, "En kuullut mitään. Voitko toistaa?", "fi");
    collectInput(vr, { soniox: false, language: "fi" });
    return new NextResponse(vr.toString(), { headers: { "content-type": "text/xml" } });
  }

  try {
    const turn = await handleVoiceTurn(callSid, transcript, from);
    await speak(vr, turn.reply, turn.language);
    collectInput(vr, { soniox: false, language: turn.language });
  } catch (err) {
    console.error("[twilio/gather] virhe:", err);
    await speak(vr, "Tekninen virhe. Soitathan hetken kuluttua uudelleen.", "fi");
    vr.hangup();
  }

  return new NextResponse(vr.toString(), { headers: { "content-type": "text/xml" } });
}
