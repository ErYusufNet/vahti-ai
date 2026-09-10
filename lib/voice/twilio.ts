/**
 * Görev 9 — Twilio-apurit: allekirjoituksen tarkistus + nauhoituksen lataus.
 */
import twilio from "twilio";
import { env } from "@/lib/env";

export function isTwilioConfigured(): boolean {
  return !!(env.twilioSid() && env.twilioAuthToken() && env.twilioPhoneNumber());
}

/**
 * Tarkistaa `X-Twilio-Signature`-otsakkeen. Ilman auth-tokenia (kehitys)
 * ohitetaan tarkistus.
 */
export function validateTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>,
): boolean {
  const token = env.twilioAuthToken();
  if (!token) return true; // ei tokenia → ei tarkistusta
  if (!signature) return false;
  return twilio.validateRequest(token, signature, url, params);
}

/** Lataa Twilion nauhoituksen bytet (vaatii Basic Authin SID:llä + tokenilla). */
export async function downloadTwilioRecording(
  recordingUrl: string,
): Promise<{ buf: Buffer; contentType: string }> {
  const sid = env.twilioSid();
  const token = env.twilioAuthToken();
  if (!sid || !token) throw new Error("Twilio-tunnukset puuttuvat");

  // Pyydä wav-muodossa (Deepgramille selkeä)
  const url = recordingUrl.endsWith(".wav") ? recordingUrl : `${recordingUrl}.wav`;
  const res = await fetch(url, {
    headers: {
      authorization:
        "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
    },
  });
  if (!res.ok) {
    throw new Error(`Twilio recording -lataus epäonnistui ${res.status}`);
  }
  return {
    buf: Buffer.from(await res.arrayBuffer()),
    contentType: res.headers.get("content-type") ?? "audio/wav",
  };
}

export { twilio };
