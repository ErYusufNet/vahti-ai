/**
 * Görev 9 — puheentunnistus (STT) Deepgramilla (OIKEA API, raaka HTTP).
 *
 * Soniox'a geçildi — puhelinvirta käyttää nyt lib/voice/soniox-stt.ts:ää.
 * Tämä tiedosto on jätetty ennalleen mahdollista myöhempää vertailua varten,
 * eikä se ole enää kytketty mihinkään webhookiin.
 *
 * POST https://api.deepgram.com/v1/listen  (Authorization: Token <key>)
 * Malli `nova-2` + `detect_language` → suomi ja englanti.
 * Ilman `DEEPGRAM_API_KEY`:tä palauttaa `{ configured: false }` ja kutsuja
 * käyttää Twilion omaa puheentunnistusta (<Gather input="speech">).
 */
import { env } from "@/lib/env";

export function isDeepgramConfigured(): boolean {
  return !!env.deepgramKey();
}

export type SttResult =
  | { configured: true; transcript: string; language: string }
  | { configured: false };

export async function transcribeAudio(
  audio: Buffer,
  mimetype = "audio/wav",
): Promise<SttResult> {
  const key = env.deepgramKey();
  if (!key) return { configured: false };

  const qs = new URLSearchParams({
    model: "nova-2",
    detect_language: "true",
    smart_format: "true",
    punctuate: "true",
  });
  const res = await fetch(`https://api.deepgram.com/v1/listen?${qs}`, {
    method: "POST",
    headers: { authorization: `Token ${key}`, "content-type": mimetype },
    body: new Uint8Array(audio),
  });
  if (!res.ok) {
    throw new Error(`Deepgram-virhe ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    results?: {
      channels?: {
        detected_language?: string;
        alternatives?: { transcript?: string }[];
      }[];
    };
  };
  const channel = data.results?.channels?.[0];
  return {
    configured: true,
    transcript: channel?.alternatives?.[0]?.transcript?.trim() ?? "",
    language: channel?.detected_language ?? "fi",
  };
}
