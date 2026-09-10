/**
 * Görev 6 — Google Calendar -integraatio.
 *
 * TODO (oikea API): vaatii Google Cloud -projektin + OAuth 2.0 -tunnukset
 * (Calendar API käyttöön). Lisää `.env`-tiedostoon:
 *   GOOGLE_CALENDAR_CLIENT_ID=...
 *   GOOGLE_CALENDAR_CLIENT_SECRET=...
 *   GOOGLE_CALENDAR_REFRESH_TOKEN=...
 *   GOOGLE_CALENDAR_ID=primary
 * Hae ne: https://console.cloud.google.com → "APIs & Services" → ota
 * "Google Calendar API" käyttöön → luo OAuth-tunnukset → hae refresh token
 * (esim. OAuth Playgroundilla). Asenna sitten `googleapis` ja kutsu
 * `calendar.events.insert`.
 *
 * Tällä hetkellä palauttaa mock-tapahtuman, jotta agentin "randevu_olustur"
 * -työkalu toimii päästä päähän ilman oikeaa tiliä.
 */

export type CalendarEventInput = {
  summary: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  contact?: string;
};

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string;
  mode: "mock" | "google";
};

export function isGoogleCalendarConfigured(): boolean {
  return (
    !!process.env.GOOGLE_CALENDAR_CLIENT_ID &&
    !!process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
  );
}

export function createCalendarEvent(input: CalendarEventInput): CalendarEvent {
  if (isGoogleCalendarConfigured()) {
    // TODO: kutsu googleapis-kirjastoa (calendar.events.insert).
    throw new Error(
      "Google Calendar -integraatiota ei ole vielä toteutettu (Görev 6).",
    );
  }

  return {
    id: `mock_evt_${Math.random().toString(36).slice(2, 10)}`,
    summary: input.summary,
    start: `${input.date}T${input.time}:00`,
    mode: "mock",
  };
}
