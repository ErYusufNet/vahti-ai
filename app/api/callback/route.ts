import { NextResponse } from "next/server";
import { createCallbackRequest, getBackupNumber } from "@/lib/callbacks";
import { integrationStatus } from "@/lib/env";

/** Widgetin fallback-näyttö kysyy varayhteystiedot tästä. */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? undefined;
  return NextResponse.json({
    backupNumber: await getBackupNumber(slug),
    twilioConfigured: integrationStatus().twilio,
  });
}

/**
 * GÖREV A — POST /api/callback
 * Selaimen puhelu-widgetin fallback-lomakkeesta jätetty yhteydenottopyyntö.
 * Tallennetaan CallbackRequest-tauluun (tai muistiin ilman DB:tä) ja jaetaan
 * round-robinilla tiimin jäsenelle.
 */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const nimi = String(b.nimi ?? "").trim();
  const viesti = String(b.viesti ?? "").trim();
  if (!nimi || !viesti) {
    return NextResponse.json(
      { ok: false, error: "Nimi ja viesti vaaditaan." },
      { status: 400 },
    );
  }

  const res = await createCallbackRequest({
    nimi,
    viesti,
    email: typeof b.email === "string" ? b.email : undefined,
    puhelin: typeof b.puhelin === "string" ? b.puhelin : undefined,
    aihe: typeof b.aihe === "string" ? b.aihe : undefined,
    tapa: b.tapa === "aani" ? "aani" : "teksti",
    lahde: b.lahde === "call-link" ? "call-link" : "widget",
    slug: typeof b.slug === "string" ? b.slug : undefined,
  });

  return NextResponse.json(res, { status: res.ok ? 201 : 500 });
}
