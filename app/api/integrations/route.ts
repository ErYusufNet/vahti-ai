import { NextResponse } from "next/server";
import { integrationStatus } from "@/lib/env";
import { isDbAvailable } from "@/lib/db";

/**
 * Kaikkien integraatioiden tila yhdessä paikassa.
 * `true`  = avain löytyi → oikea API käytössä
 * `false` = avain puuttuu → demo/mock-tila
 */
export async function GET() {
  const s = integrationStatus();
  return NextResponse.json({
    database: await isDbAvailable(),
    anthropic: s.anthropic,
    whatsapp: s.whatsapp,
    googleCalendar: s.googleCalendar,
    embeddings: s.embeddings,
    twilio: s.twilio,
    soniox: s.soniox,
    // Säilytetty vertailua varten — eivät enää kytkettynä puhelinvirtaan.
    deepgram: s.deepgram,
    elevenlabs: s.elevenlabs,
  });
}
