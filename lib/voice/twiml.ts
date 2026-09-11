/**
 * Görev 9 — TwiML-rakennusapurit. Puhe tuotetaan Sonioxilla jos avain on,
 * muuten Twilion omalla <Say>-äänellä.
 */
import { twilio } from "./twilio";
import { synthesizeSpeech } from "./soniox-tts";
import { putAudio } from "./store";
import { env } from "@/lib/env";

type VoiceResponse = InstanceType<typeof twilio.twiml.VoiceResponse>;

export function newVoiceResponse(): VoiceResponse {
  return new twilio.twiml.VoiceResponse();
}

const sayLang = (language: string) =>
  language.startsWith("en") ? "en-US" : "fi-FI";

/** Lisää puhetta vastaukseen: <Play> (Soniox TTS) tai <Say> (Twilio). */
export async function speak(
  vr: VoiceResponse,
  text: string,
  language = "fi",
): Promise<void> {
  const wav = await synthesizeSpeech(text, language);
  if (wav) {
    const id = putAudio(wav, "audio/wav");
    vr.play(`${env.appBaseUrl()}/api/voice/audio/${id}`);
  } else {
    vr.say({ language: sayLang(language) }, text);
  }
}

/** Lisää seuraavan syötteen keräys: <Record> (Soniox STT) tai <Gather> (Twilio STT). */
export function collectInput(
  vr: VoiceResponse,
  opts: { soniox: boolean; language?: string },
): void {
  if (opts.soniox) {
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
