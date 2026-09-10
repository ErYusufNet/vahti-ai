import { NextResponse } from "next/server";
import { getAudio } from "@/lib/voice/store";

/**
 * Görev 9 — tarjoilee ElevenLabsin generoiman mp3:n Twilion <Play>-verbille.
 * Äänet elävät muistissa lyhyen TTL:n ajan (lib/voice/store.ts).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = getAudio(id);
  if (!entry) {
    return new NextResponse("Not found or expired", { status: 404 });
  }
  return new NextResponse(new Uint8Array(entry.buf), {
    headers: {
      "content-type": entry.contentType,
      "content-length": String(entry.buf.length),
      "cache-control": "no-store",
    },
  });
}
