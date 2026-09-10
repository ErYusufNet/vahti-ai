import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withDb } from "@/lib/db";

/** GÖREV C — POST /api/settings/backup : tallentaa klinikan PSTN-varanumeron. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { number?: unknown };
  const num = String(body.number ?? "").trim() || null;

  const res = await withDb<{ ok: boolean; backend: "db" | "mock" }>(
    async (db) => {
      const k = await db.klinik.findFirst();
      if (!k) return { ok: false, backend: "db" };
      await db.klinik.update({
        where: { id: k.id },
        data: { varayhteysNumero: num },
      });
      return { ok: true, backend: "db" };
    },
    { ok: false, backend: "mock" },
    "saveBackupNumber",
  );

  return NextResponse.json(res);
}
