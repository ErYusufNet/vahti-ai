/**
 * Görev 6 — Google Calendar -integraatio (OIKEA API).
 *
 * Käyttää OAuth 2.0 refresh token -virtaa: refresh token → access token →
 * `calendar.events.insert`. Ei ulkoista SDK:ta, pelkkä fetch.
 *
 * Ilman avaimia (`GOOGLE_CALENDAR_CLIENT_ID/_SECRET/_REFRESH_TOKEN`)
 * palauttaa demo-tapahtuman `mode: "mock"` eikä kaada agenttia.
 *
 * Avainten hankinta: ks. README ("API-avaimet") tai .env.example.
 */
import { env } from "@/lib/env";

export type CalendarEventInput = {
  summary: string;
  description?: string;
  /** Alkuaika ISO-8601, esim. "2026-09-18T14:00:00" (paikallinen aika + timezone-kenttä). */
  startIso: string;
  durationMin?: number;
  timezone?: string;
  attendeeEmail?: string;
};

export type CalendarEventResult = {
  id: string;
  htmlLink?: string;
  start: string;
  mode: "google" | "mock";
};

export function isGoogleCalendarConfigured(): boolean {
  return !!(
    env.googleClientId() &&
    env.googleClientSecret() &&
    env.googleRefreshToken()
  );
}

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.googleClientId()!,
      client_secret: env.googleClientSecret()!,
      refresh_token: env.googleRefreshToken()!,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`Google OAuth -virhe ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createCalendarEvent(
  input: CalendarEventInput,
): Promise<CalendarEventResult> {
  const durationMin = input.durationMin ?? 45;
  const start = new Date(input.startIso);
  const end = new Date(start.getTime() + durationMin * 60_000);
  const tz = input.timezone ?? "Europe/Helsinki";

  // --- "Anahtar yok" -modu ------------------------------------------------
  if (!isGoogleCalendarConfigured()) {
    console.warn(
      "[google-calendar] avaimet puuttuvat — luodaan demo-tapahtuma (ei viety kalenteriin).",
    );
    return {
      id: `mock_evt_${Math.random().toString(36).slice(2, 10)}`,
      start: start.toISOString(),
      mode: "mock",
    };
  }

  // --- Oikea API --------------------------------------------------------
  const token = await getAccessToken();
  const calId = encodeURIComponent(env.googleCalendarId());
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calId}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: start.toISOString(), timeZone: tz },
        end: { dateTime: end.toISOString(), timeZone: tz },
        attendees: input.attendeeEmail ? [{ email: input.attendeeEmail }] : undefined,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(
      `Google Calendar events.insert -virhe ${res.status}: ${await res.text()}`,
    );
  }
  const ev = (await res.json()) as {
    id: string;
    htmlLink?: string;
    start: { dateTime?: string };
  };
  return {
    id: ev.id,
    htmlLink: ev.htmlLink,
    start: ev.start.dateTime ?? start.toISOString(),
    mode: "google",
  };
}
