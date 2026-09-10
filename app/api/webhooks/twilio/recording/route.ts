import { NextResponse } from "next/server";
import { newVoiceResponse, speak, collectInput } from "@/lib/voice/twiml";
import {
  validateTwilioSignature,
  downloadTwilioRecording,
} from "@/lib/voice/twilio";
import { transcribeAudio, isDeepgramConfigured } from "@/lib/voice/stt";
import { handleVoiceTurn } from "@/lib/voice/pipeline";

/**
 * Görev 9 — Twilio <Record action> -takaisinkutsu.
 * Lataa nauhoituksen → Deepgram STT → Claude → puhuu vastauksen → kerää seuraavan.
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
  const recordingUrl = params.RecordingUrl;

  const vr = newVoiceResponse();

  try {
    if (!recordingUrl || !isDeepgramConfigured()) {
      await speak(vr, "Valitettavasti en saanut puhettasi. Yritetään uudelleen.", "fi");
      collectInput(vr, { deepgram: isDeepgramConfigured(), language: "fi" });
      return xml(vr);
    }

    const { buf, contentType } = await downloadTwilioRecording(recordingUrl);
    const stt = await transcribeAudio(buf, contentType);
    const transcript = stt.configured ? stt.transcript : "";

    if (!transcript) {
      await speak(vr, "En kuullut mitään. Voitko toistaa?", "fi");
      collectInput(vr, { deepgram: true, language: "fi" });
      return xml(vr);
    }

    const turn = await handleVoiceTurn(callSid, transcript, from);
    await speak(vr, turn.reply, turn.language);
    collectInput(vr, { deepgram: true, language: turn.language });
    return xml(vr);
  } catch (err) {
    console.error("[twilio/recording] virhe:", err);
    await speak(
      vr,
      "Tekninen virhe. Yhdistän sinut takaisinsoittopyyntöön.",
      "fi",
    );
    vr.hangup();
    return xml(vr);
  }
}

function xml(vr: { toString(): string }) {
  return new NextResponse(vr.toString(), {
    headers: { "content-type": "text/xml" },
  });
}
