import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/claude";
import { transcribeStream, isSonioxSttConfigured } from "@/lib/voice/soniox-stt";
import { synthesizeSpeech, isSonioxTtsConfigured } from "@/lib/voice/soniox-tts";
import { putAudio } from "@/lib/voice/store";
import { logUsage } from "@/lib/usage";

/**
 * Julkinen selainpohjainen sesli demo (EI Twilioa/puhelinlinjaa) — pelkkä
 * mikrofoni + Soniox + Claude. Käytetään laskeutumissivulla, /demo:ssa ja
 * /for-clinics:ssa (components/marketing/VoiceDemo.tsx).
 *
 * Virta: mikrofoni (selain) → tämä endpoint → Soniox STT → sama Claude-
 * agentti kuin /api/chat:ssa (system prompt + RAG, ei muutoksia) → Soniox
 * TTS → ääni-URL takaisin selaimeen.
 *
 * KVKK/GDPR: vastaanotettu äänidata (`buf`) käytetään vain tämän pyynnön
 * ajan Soniox-litterointiin — sitä ei koskaan kirjoiteta levylle/DB:hen.
 * Vain tekoälyn generoima VASTAUS-ääni tallennetaan hetkeksi (lib/voice/store,
 * muutaman minuutin TTL) toistoa varten.
 *
 * GET  : kertoo onko sesli demo käytössä (SONIOX_API_KEY asetettu).
 * POST : multipart/form-data { audio: Blob, durationMs, language? }.
 *        Ilman SONIOX_API_KEY:tä palauttaa `{ ok:false, configured:false }`
 *        eikä kaadu — frontend näyttää "kokeile kirjoitettua chattia".
 */

function isSonioxReady() {
  return isSonioxSttConfigured() && isSonioxTtsConfigured();
}

export async function GET() {
  return NextResponse.json({ configured: isSonioxReady() });
}

const MAX_AUDIO_BYTES = 8 * 1024 * 1024; // reilusti yli 20 s puhetta — väärinkäytön esto

export async function POST(req: Request) {
  if (!isSonioxReady()) {
    return NextResponse.json({ ok: false, configured: false });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Virheellinen pyyntö" }, { status: 400 });
  }

  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ ok: false, error: "Äänidataa ei saatu" }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ ok: false, error: "Nauhoitus on liian pitkä" }, { status: 413 });
  }

  const languageParam = String(form.get("language") ?? "");
  const languageHints = languageParam === "fi" || languageParam === "en" ? [languageParam] : ["fi", "en"];
  const durationMs = Number(form.get("durationMs") ?? "0");

  try {
    const buf = Buffer.from(await audio.arrayBuffer());
    const stt = await transcribeStream(buf, { languageHints });
    const transcript = stt.configured ? stt.transcript : "";

    if (!transcript) {
      return NextResponse.json({ ok: true, transcript: "", reply: null, error: "empty" });
    }

    const result = await runAgent([{ role: "user", content: transcript }]);

    let audioUrl: string | null = null;
    const replyAudio = await synthesizeSpeech(result.reply, result.language);
    if (replyAudio) {
      const id = putAudio(replyAudio, "audio/wav");
      audioUrl = `/api/voice/audio/${id}`;
    }

    // GÖREV C:n käyttöseuranta — sama "ses"-tyyppi kuin puhelinvirrassa.
    if (durationMs > 0) {
      await logUsage("ses", durationMs / 60_000);
    }

    return NextResponse.json({
      ok: true,
      transcript,
      reply: result.reply,
      language: result.language,
      mode: result.mode,
      audioUrl,
    });
  } catch (err) {
    console.error("[voice-demo] virhe:", err);
    return NextResponse.json(
      { ok: false, error: "processing-error" },
      { status: 502 },
    );
  }
}
