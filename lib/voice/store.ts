/**
 * Görev 9 — kevyt muistivarasto puheluille.
 *  - audioStore: generoidut TTS-mp3:t (id → bytet), tarjoillaan /api/voice/audio/[id]:stä
 *  - sessionStore: puhelun keskusteluhistoria (CallSid → viestit)
 * TTL siivoaa vanhat. Tuotannossa tämä voisi olla Redis / objektisäilö.
 */
type AudioEntry = { buf: Buffer; contentType: string; expires: number };
type Session = { messages: { role: "user" | "assistant"; content: string }[]; expires: number };

const AUDIO_TTL = 5 * 60_000;
const SESSION_TTL = 30 * 60_000;

const audioStore = new Map<string, AudioEntry>();
const sessionStore = new Map<string, Session>();

function sweep() {
  const now = Date.now();
  for (const [k, v] of audioStore) if (v.expires < now) audioStore.delete(k);
  for (const [k, v] of sessionStore) if (v.expires < now) sessionStore.delete(k);
}

export function putAudio(buf: Buffer, contentType = "audio/mpeg"): string {
  sweep();
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  audioStore.set(id, { buf, contentType, expires: Date.now() + AUDIO_TTL });
  return id;
}

export function getAudio(id: string): AudioEntry | undefined {
  const e = audioStore.get(id);
  if (e && e.expires < Date.now()) {
    audioStore.delete(id);
    return undefined;
  }
  return e;
}

export function getSession(callSid: string): Session {
  sweep();
  let s = sessionStore.get(callSid);
  if (!s) {
    s = { messages: [], expires: Date.now() + SESSION_TTL };
    sessionStore.set(callSid, s);
  }
  s.expires = Date.now() + SESSION_TTL;
  return s;
}

export function appendSession(
  callSid: string,
  role: "user" | "assistant",
  content: string,
) {
  getSession(callSid).messages.push({ role, content });
}
