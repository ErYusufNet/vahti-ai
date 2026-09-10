/**
 * GÖREV C — PSTN-varayhteys (soitonsiirto varanumeroon).
 *
 * Kun widget/tekoäly ei vastaa (widgetin fallback laukeaa), yhteydenotto
 * ohjataan klinikan varanumeroon. Käyttöliittymä (widgetin fallback-näyttö +
 * Asetukset → Varayhteys) näyttää tämän jo nyt.
 *
 * TODO (oikea toteutus): vaatii .env:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 * ja Twilio-numeron, jonka Voice-webhook palauttaa <Dial>varanumero</Dial>
 * -TwiML:n. Ilman TWILIO_ACCOUNT_SID:ä siirto on simuloitu (kirjataan lokiin).
 */
import { env } from "@/lib/env";

export function isForwardingConfigured(): boolean {
  return !!(env.twilioSid() && env.twilioAuthToken() && env.twilioPhoneNumber());
}

export async function forwardToBackup(
  toNumber: string,
): Promise<{ mode: "twilio" | "simulated"; note: string }> {
  if (isForwardingConfigured()) {
    // TODO: Twilio REST — päivitä aktiivinen puhelu tai luo uusi <Dial>-TwiML:llä.
    throw new Error("Twilio-soitonsiirtoa ei ole vielä toteutettu (Görev C).");
  }
  console.log(
    `[pstn] (simuloitu) yhteydenotto ohjattaisiin varanumeroon ${toNumber}`,
  );
  return {
    mode: "simulated",
    note: "TWILIO_ACCOUNT_SID puuttuu — soitonsiirto simuloitu.",
  };
}
