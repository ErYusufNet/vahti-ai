/**
 * Keskitetty ympäristömuuttujien luku + integraatioiden tila.
 *
 * Perusperiaate koko projektissa: koodi on kirjoitettu oikeilla API-kutsuilla,
 * mutta jos avain puuttuu, integraatio menee "demo/mock"-tilaan eikä kaada
 * sovellusta. `integrationStatus()` kertoo, mikä on kytketty.
 */

function get(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v && v.length > 0 ? v : undefined;
}

/** Anthropic-avain on "oikea" vain jos se ei ole tyhjä eikä placeholder. */
export function anthropicKey(): string | undefined {
  const key = get("ANTHROPIC_API_KEY");
  if (!key) return undefined;
  if (key.includes("xxxx") || key === "sk-ant-fake") return undefined;
  return key.startsWith("sk-ant-") && key.length > 24 ? key : undefined;
}

export const env = {
  // Görev 2
  anthropicModel: () => get("ANTHROPIC_MODEL") ?? "claude-sonnet-5",

  // Görev 5 — WhatsApp Business Cloud API
  whatsappToken: () => get("WHATSAPP_TOKEN"),
  whatsappPhoneId: () => get("WHATSAPP_PHONE_ID"),
  whatsappVerifyToken: () => get("WHATSAPP_VERIFY_TOKEN"),
  whatsappApiVersion: () => get("WHATSAPP_API_VERSION") ?? "v21.0",

  // Görev 6 — Google Calendar
  googleClientId: () => get("GOOGLE_CALENDAR_CLIENT_ID"),
  googleClientSecret: () => get("GOOGLE_CALENDAR_CLIENT_SECRET"),
  googleRefreshToken: () => get("GOOGLE_CALENDAR_REFRESH_TOKEN"),
  googleCalendarId: () => get("GOOGLE_CALENDAR_ID") ?? "primary",

  // Görev 7 — Embeddingit (RAG)
  embeddingProvider: () =>
    (get("EMBEDDING_PROVIDER") ?? "openai").toLowerCase() as "openai" | "voyage",
  openaiKey: () => get("OPENAI_API_KEY"),
  voyageKey: () => get("VOYAGE_API_KEY"),

  // Görev 8 — Automaatiot
  cronEnabled: () => (get("ENABLE_CRON") ?? "true") !== "false",
  appBaseUrl: () => get("APP_BASE_URL") ?? "http://localhost:3000",

  // Görev 9 — Sesli AI
  twilioSid: () => get("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: () => get("TWILIO_AUTH_TOKEN"),
  twilioPhoneNumber: () => get("TWILIO_PHONE_NUMBER"),
  deepgramKey: () => get("DEEPGRAM_API_KEY"),
  elevenLabsKey: () => get("ELEVENLABS_API_KEY"),
  elevenLabsVoiceId: () => get("ELEVENLABS_VOICE_ID") ?? "21m00Tcm4TlvDq8ikWAM",

  // Tietokanta
  databaseUrl: () => get("DATABASE_URL"),
};

export type IntegrationName =
  | "anthropic"
  | "whatsapp"
  | "googleCalendar"
  | "embeddings"
  | "twilio"
  | "deepgram"
  | "elevenlabs";

export function integrationStatus(): Record<IntegrationName, boolean> {
  return {
    anthropic: !!anthropicKey(),
    whatsapp: !!(env.whatsappToken() && env.whatsappPhoneId()),
    googleCalendar: !!(
      env.googleClientId() &&
      env.googleClientSecret() &&
      env.googleRefreshToken()
    ),
    embeddings:
      env.embeddingProvider() === "voyage"
        ? !!env.voyageKey()
        : !!env.openaiKey(),
    twilio: !!(env.twilioSid() && env.twilioAuthToken() && env.twilioPhoneNumber()),
    deepgram: !!env.deepgramKey(),
    elevenlabs: !!env.elevenLabsKey(),
  };
}

/** Heitetään, kun oikeaa kutsua yritetään ilman avainta (kutsuja nappaa ja siirtyy mockiin). */
export class MissingKeyError extends Error {
  constructor(public integration: IntegrationName) {
    super(`Integraation "${integration}" API-avain puuttuu (.env)`);
    this.name = "MissingKeyError";
  }
}
