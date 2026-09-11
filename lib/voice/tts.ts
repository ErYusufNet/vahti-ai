/**
 * Görev 9 — puhesynteesi (TTS) ElevenLabsilla (OIKEA API).
 *
 * Soniox'a geçildi — puhelinvirta käyttää nyt lib/voice/soniox-tts.ts:ää.
 * Tämä tiedosto on jätetty ennalleen mahdollista myöhempää vertailua varten,
 * eikä se ole enää kytketty mihinkään webhookiin.
 *
 * Malli `eleven_multilingual_v2` → suomi + englanti.
 * Ilman `ELEVENLABS_API_KEY`:tä palauttaa `null`, jolloin kutsuja käyttää
 * Twilion omaa <Say>-ääntä.
 */
import { env } from "@/lib/env";

export function isElevenLabsConfigured(): boolean {
  return !!env.elevenLabsKey();
}

/** Palauttaa mp3-bytet tai null jos avain puuttuu / kutsu epäonnistuu. */
export async function synthesizeSpeech(text: string): Promise<Buffer | null> {
  const key = env.elevenLabsKey();
  if (!key) return null;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${env.elevenLabsVoiceId()}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.slice(0, 2500),
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.4, similarity_boost: 0.75 },
      }),
    },
  );
  if (!res.ok) {
    console.error(`[tts] ElevenLabs-virhe ${res.status}: ${await res.text()}`);
    return null;
  }
  return Buffer.from(await res.arrayBuffer());
}
