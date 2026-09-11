/**
 * Görev 9 — puhelun orkestrointi (ei-striimaava):
 *   nauhoitus → Soniox STT → Claude-agentti → Soniox TTS → Twilio <Play>
 *
 * Striimauksen (matala viive) voi lisätä myöhemmin Twilio Media Streams +
 * Sonioxin reaaliaikaisella WebSocket-yhteydellä (lib/voice/soniox-stt.ts
 * tukee jo async-striimin syöttöä); tämä on toimeksiannon mukainen
 * "aloita yksinkertaisesta" -versio (kokonainen nauhoitus kerrallaan).
 */
import { runAgent, type ChatMsg } from "@/lib/agent/claude";
import { appendConversationTurn } from "@/lib/conversations";
import { appendSession, getSession } from "./store";
import { integrationStatus } from "@/lib/env";

export function voiceIntegrationSummary() {
  const s = integrationStatus();
  return {
    twilio: s.twilio,
    soniox: s.soniox,
    anthropic: s.anthropic,
    // Säilytetty vertailua varten — eivät enää käytössä puhelinvirrassa.
    deepgram: s.deepgram,
    elevenlabs: s.elevenlabs,
  };
}

/**
 * Yksi puhelun vuoro: litteroitu teksti → agentin vastausteksti.
 * Säilyttää keskusteluhistorian CallSid:n mukaan.
 */
export async function handleVoiceTurn(
  callSid: string,
  transcript: string,
  fromNumber: string,
): Promise<{ reply: string; language: "fi" | "en"; mode: string }> {
  appendSession(callSid, "user", transcript);
  const history: ChatMsg[] = getSession(callSid).messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const result = await runAgent(history);
  appendSession(callSid, "assistant", result.reply);

  // Talteen tietokantaan (no-op ilman DB:tä)
  await appendConversationTurn({
    channel: "voice",
    contact: fromNumber,
    lang: result.language,
    userText: transcript,
    aiText: result.reply,
  });

  return { reply: result.reply, language: result.language, mode: result.mode };
}
