/**
 * Görev 9 — Ääni-/puhelukanava RUNKO (monimutkaisin, tehdään viimeisenä).
 *
 * Kokonaisputki:  Twilio (SIP/puhelu)  →  Deepgram (STT, suomi)  →
 *                 Claude (agentti)     →  TTS (ElevenLabs/Azure)  →  Twilio
 * Toteutetaan striimaavana (matala viive).
 *
 * TODO — tarvittavat tilit ja avaimet (.env):
 *   TWILIO_ACCOUNT_SID=AC...          Twilio-numero + Media Streams
 *   TWILIO_AUTH_TOKEN=...             https://console.twilio.com
 *   TWILIO_PHONE_NUMBER=+358...
 *   DEEPGRAM_API_KEY=...              suomen STT — https://console.deepgram.com
 *                                    (varmista Fince-mallin laatu ensin!)
 *   ELEVENLABS_API_KEY=...            TTS — https://elevenlabs.io
 *   (tai AZURE_SPEECH_KEY + AZURE_SPEECH_REGION)
 *
 * Tila nyt: pelkät tyyppimäärittelyt ja funktioiden kuoret. Puhelunäkymä
 * (/dashboard/calls) toimii mock-datalla, mutta oikeaa puhelua ei käsitellä.
 */
import { runAgent } from "@/lib/agent/claude";

export type VoiceTurn = { role: "caller" | "agent"; text: string };

export function isVoiceConfigured(): boolean {
  return !!process.env.TWILIO_ACCOUNT_SID && !!process.env.DEEPGRAM_API_KEY;
}

/** TODO: Deepgram-striimaus (WebSocket) → tekstipätkät. */
export async function transcribeStream(): Promise<never> {
  throw new Error("transcribeStream(): Deepgram-STT ei ole kytketty (Görev 9).");
}

/** TODO: TTS-striimaus → ääni takaisin Twilioon. */
export async function synthesizeSpeech(_text: string): Promise<never> {
  throw new Error("synthesizeSpeech(): TTS ei ole kytketty (Görev 9).");
}

/**
 * Ainoa osa, joka toimii jo: litteroitu teksti → agentin vastausteksti.
 * (STT ja TTS puuttuvat edelleen.)
 */
export async function handleTranscribedUtterance(text: string): Promise<string> {
  const result = await runAgent([{ role: "user", content: text }]);
  return result.reply;
}
