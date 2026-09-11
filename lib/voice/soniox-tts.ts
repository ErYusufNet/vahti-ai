/**
 * Sesli AI — puhesynteesi (TTS) Sonioxilla (OIKEA API, WebSocket).
 *
 * wss://tts-rt.soniox.com/tts-websocket
 * Ensimmäinen viesti on JSON-konfiguraatio (api_key, malli, ääni, kieli,
 * audio_format), toinen viesti sisältää tekstin (`text_end: true`, koska
 * emme striimaa tekstiä paloissa). Palvelin vastaa base64-koodatuilla
 * ääniparoilla kunnes `audio_end`/`terminated`.
 *
 * Malli `tts-rt-v2` → sama ääni toimii kaikilla 60+ kielellä (myös suomi +
 * englanti), joten kieli vain kerrotaan konfiguraatiossa (`language`).
 * Ilman `SONIOX_API_KEY`:tä palauttaa `null`, jolloin kutsuja käyttää
 * Twilion omaa <Say>-ääntä.
 *
 * HUOM: tämä korvaa lib/voice/tts.ts:n (ElevenLabs) puhelinvirrassa — se
 * tiedosto on jätetty ennalleen mahdollista vertailua varten.
 */
import { env } from "@/lib/env";

const SONIOX_TTS_URL = "wss://tts-rt.soniox.com/tts-websocket";

export function isSonioxTtsConfigured(): boolean {
  return !!env.sonioxKey();
}

type TtsMessage = {
  audio?: string;
  audio_end?: boolean;
  terminated?: boolean;
  error_code?: number | null;
  error_type?: string | null;
  error_message?: string | null;
};

/** Palauttaa wav-bytet tai null jos avain puuttuu / kutsu epäonnistuu. */
export function synthesizeSpeech(text: string, language = "fi"): Promise<Buffer | null> {
  const key = env.sonioxKey();
  if (!key) return Promise.resolve(null);

  const lang = language.startsWith("en") ? "en" : "fi";
  const streamId = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  return new Promise<Buffer | null>((resolve) => {
    const chunks: Buffer[] = [];
    let settled = false;

    const ws = new WebSocket(SONIOX_TTS_URL);

    const finish = (result: Buffer | null) => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {
        /* ei väliä */
      }
      resolve(result);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          api_key: key,
          model: "tts-rt-v2",
          language: lang,
          voice: env.sonioxVoice(),
          audio_format: "wav",
          stream_id: streamId,
        }),
      );
      ws.send(
        JSON.stringify({ text: text.slice(0, 4000), text_end: true, stream_id: streamId }),
      );
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as TtsMessage;
        if (msg.error_code) {
          console.error(
            `[soniox-tts] virhe ${msg.error_code}${msg.error_type ? ` (${msg.error_type})` : ""}: ${msg.error_message ?? ""}`,
          );
          finish(null);
          return;
        }
        if (msg.audio) chunks.push(Buffer.from(msg.audio, "base64"));
        if (msg.audio_end || msg.terminated) {
          finish(chunks.length ? Buffer.concat(chunks) : null);
        }
      } catch (err) {
        console.error("[soniox-tts] viestin jäsennys epäonnistui:", err);
      }
    };

    ws.onerror = () => {
      console.error("[soniox-tts] WebSocket-yhteys epäonnistui");
      finish(null);
    };
    ws.onclose = () => finish(chunks.length ? Buffer.concat(chunks) : null);
  });
}
