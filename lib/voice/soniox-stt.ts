/**
 * Sesli AI — puheentunnistus (STT) Sonioxilla (OIKEA API, WebSocket).
 *
 * wss://stt-rt.soniox.com/transcribe-websocket
 * Ensimmäinen viesti on JSON-konfiguraatio (api_key, malli, language_hints),
 * sen jälkeen lähetetään ääni tavuina ja lopuksi tyhjä merkkijono
 * (end-of-audio). Palvelin vastaa JSON-viesteillä, joissa on `tokens[]`
 * (kukin `is_final`-lipulla) kunnes `finished: true`.
 *
 * Malli `stt-rt-v5` + `language_hints: ["fi", "en"]` → suomi ja englanti,
 * `enable_language_identification` tunnistaa kumpi kieli on kyseessä.
 * Ilman `SONIOX_API_KEY`:tä palauttaa `{ configured: false }` ja kutsuja
 * käyttää Twilion omaa puheentunnistusta (<Gather input="speech">).
 *
 * HUOM: tämä korvaa lib/voice/stt.ts:n (Deepgram) puhelinvirrassa — se
 * tiedosto on jätetty ennalleen mahdollista vertailua varten.
 */
import { env } from "@/lib/env";

const SONIOX_STT_URL = "wss://stt-rt.soniox.com/transcribe-websocket";

export function isSonioxSttConfigured(): boolean {
  return !!env.sonioxKey();
}

export type SonioxSttResult =
  | { configured: true; transcript: string; language: string }
  | { configured: false };

type SttToken = { text?: string; is_final?: boolean; language?: string };
type SttMessage = {
  tokens?: SttToken[];
  finished?: boolean;
  error_code?: number | null;
  error_type?: string | null;
  error_message?: string | null;
};

/**
 * Litteroi äänidatan Sonioxin reaaliaikaisella WebSocket-rajapinnalla.
 * `audio` voi olla valmis Buffer (esim. Twilion ladattu nauhoitus) tai
 * async-iteroitava paloittainen striimi (esim. tuleva Twilio Media Stream) —
 * molemmat lähetetään palvelimelle samalla tavalla.
 */
export function transcribeStream(
  audio: Buffer | AsyncIterable<Buffer | Uint8Array>,
  opts: { languageHints?: string[] } = {},
): Promise<SonioxSttResult> {
  const key = env.sonioxKey();
  if (!key) return Promise.resolve({ configured: false });

  const languageHints = opts.languageHints ?? ["fi", "en"];

  return new Promise<SonioxSttResult>((resolve, reject) => {
    let transcript = "";
    let language = languageHints[0] ?? "fi";
    let settled = false;

    const ws = new WebSocket(SONIOX_STT_URL);

    const finish = (result: SonioxSttResult) => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {
        /* ei väliä */
      }
      resolve(result);
    };

    const fail = (err: unknown) => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {
        /* ei väliä */
      }
      reject(err instanceof Error ? err : new Error(String(err)));
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          api_key: key,
          model: "stt-rt-v5",
          audio_format: "auto",
          language_hints: languageHints,
          enable_language_identification: true,
        }),
      );

      (async () => {
        if (Buffer.isBuffer(audio)) {
          ws.send(new Uint8Array(audio));
        } else {
          for await (const chunk of audio) {
            ws.send(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk));
          }
        }
        ws.send(""); // end-of-audio -merkki
      })().catch(fail);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as SttMessage;
        if (msg.error_code) {
          fail(
            new Error(
              `Soniox STT -virhe ${msg.error_code}${msg.error_type ? ` (${msg.error_type})` : ""}: ${msg.error_message ?? ""}`,
            ),
          );
          return;
        }
        for (const tok of msg.tokens ?? []) {
          if (tok.is_final && tok.text) {
            transcript += tok.text;
            if (tok.language) language = tok.language;
          }
        }
        if (msg.finished) {
          finish({ configured: true, transcript: transcript.trim(), language });
        }
      } catch (err) {
        console.error("[soniox-stt] viestin jäsennys epäonnistui:", err);
      }
    };

    ws.onerror = () => fail(new Error("Soniox STT -WebSocket-yhteys epäonnistui"));
    ws.onclose = () => finish({ configured: true, transcript: transcript.trim(), language });
  });
}
