/**
 * Görev 9 — TwiML-rakennusapurit. Puhe tuotetaan ElevenLabsilla jos avain on,
 * muuten Twilion omalla <Say>-äänellä.
 */
import { twilio } from "./twilio";
import { synthesizeSpeech } from "./tts";
import { putAudio } from "./store";
import { env } from "@/lib/env";

type VoiceResponse = InstanceType<typeof twilio.twiml.VoiceResponse>;

export function newVoiceResponse(): VoiceResponse {
  return new twilio.twiml.VoiceResponse();
}

const sayLang = (language: string) =>
  language.startsWith("en") ? "en-US" : "fi-FI";

/** Lisää puhetta vastaukseen: <Play> (ElevenLabs) tai <Say> (Twilio). */
export async function speak(
  vr: VoiceResponse,
  text: string,
  language = "fi",
): Promise<void> {
  const mp3 = await synthesizeSpeech(text);
  if (mp3) {
    const id = putAudio(mp3, "audio/mpeg");
    vr.play(`${env.appBaseUrl()}/api/voice/audio/${id}`);
  } else {
    vr.say({ language: sayLang(language) }, text);
  }
}

/** Lisää seuraavan syötteen keräys: <Record> (Deepgram) tai <Gather> (Twilio STT). */
export function collectInput(
  vr: VoiceResponse,
  opts: { deepgram: boolean; language?: string },
): void {
  if (opts.deepgram) {
    vr.record({
      action: `${env.appBaseUrl()}/api/webhooks/twilio/recording`,
      method: "POST",
      maxLength: 20,
      timeout: 3,
      playBeep: true,
      trim: "trim-silence",
    });
  } else {
    const gather = vr.gather({
      input: ["speech"],
      action: `${env.appBaseUrl()}/api/webhooks/twilio/gather`,
      method: "POST",
      speechTimeout: "auto",
      language: (opts.language?.startsWith("en") ? "en-US" : "fi-FI") as "fi-FI",
    });
    // jos ei puhuta, toistetaan kysymys
    gather.say(
      { language: opts.language?.startsWith("en") ? "en-US" : "fi-FI" },
      opts.language?.startsWith("en") ? "I'm listening." : "Kuuntelen.",
    );
  }
}
