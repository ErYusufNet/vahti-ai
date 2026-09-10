import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDbAvailable } from "@/lib/db";

/**
 * GÖREV C — POST /api/signup
 * Body: { name, clinicName, email, password }
 * DB:llä → luo klinikan + omistaja-käyttäjän (bcrypt-tiiviste).
 * Ilman DB:tä → 200 { demo: true }, ja ohjeistetaan käyttämään demo-tunnuksia.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const clinicName = String(body.clinicName ?? "").trim();
  const city = String(body.city ?? "").trim();
  const sector = String(body.sector ?? "").trim();
  const validPlans = ["essential", "professional", "business", "enterprise"];
  const plan = validPlans.includes(String(body.plan)) ? String(body.plan) : "essential";
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Nimi, sähköposti ja salasana vaaditaan." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Salasanan on oltava vähintään 8 merkkiä." },
      { status: 400 },
    );
  }

  if (!(await isDbAvailable())) {
    return NextResponse.json({
      ok: false,
      demo: true,
      message:
        "Tietokantaa ei ole käytössä — rekisteröinti ei tallennu. Kirjaudu demo-tunnuksilla: demo@vahti.ai / demo1234",
    });
  }

  const existing = await prisma.kullanici.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "Tällä sähköpostilla on jo tili." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const klinik = await tx.klinik.create({
      data: {
        ad: clinicName || `${name} — klinikka`,
        email,
        sehir: city || null,
        sektor: sector || null,
        ulke: "FI",
        plan,
      },
    });
    await tx.kullanici.create({
      data: {
        klinikId: klinik.id,
        ad: name,
        email,
        rol: "omistaja",
        passwordHash,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
