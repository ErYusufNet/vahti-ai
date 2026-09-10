/**
 * Keskustelujen tallennus tietokantaan (Görev 5 + 9).
 * Ilman DB:tä nämä ovat no-op (mock-tilassa dashboard näyttää lib/mock/data.ts:n).
 */
import { withDb } from "@/lib/db";
import { clinic as MOCK_CLINIC } from "@/lib/mock/data";

type Role = "potilas" | "tekoäly" | "hoitaja";
export type StoredMessage = { rooli: Role; teksti: string; aika: string };

function hhmm(d = new Date()): string {
  return d.toTimeString().slice(0, 5);
}

/**
 * Tallentaa yhden vuoron (potilaan viesti + tekoälyn vastaus) keskusteluun.
 * Luo tarvittaessa klinikan, liidin ja keskustelun.
 */
type TurnResult = { saved: boolean; leadId?: string; conversationId?: string };

export async function appendConversationTurn(opts: {
  channel: string; // "whatsapp" | "voice" | ...
  contact: string; // puhelinnumero
  name?: string;
  lang?: string;
  userText: string;
  aiText: string;
}): Promise<TurnResult> {
  return withDb<TurnResult>(
    async (db) => {
      let klinik = await db.klinik.findFirst();
      klinik ??= await db.klinik.create({
        data: {
          ad: MOCK_CLINIC.ad,
          email: MOCK_CLINIC.email,
          telefon: MOCK_CLINIC.telefon,
          sehir: MOCK_CLINIC.sehir,
          ulke: MOCK_CLINIC.ulke,
          sektor: MOCK_CLINIC.sektor,
        },
      });

      let lead = await db.lead.findFirst({
        where: { klinikId: klinik.id, puhelin: opts.contact },
      });
      lead ??= await db.lead.create({
        data: {
          klinikId: klinik.id,
          isim: opts.name ?? null,
          puhelin: opts.contact,
          dil: opts.lang ?? "fi",
          kaynakKanal: opts.channel,
          pipelineAsamasi: "uusi",
          sonYhteysAika: new Date(),
        },
      });

      const turn: StoredMessage[] = [
        { rooli: "potilas", teksti: opts.userText, aika: hhmm() },
        { rooli: "tekoäly", teksti: opts.aiText, aika: hhmm() },
      ];

      const existing = await db.konusma.findFirst({
        where: { leadId: lead.id, kanal: opts.channel },
        orderBy: { createdAt: "desc" },
      });

      let conversationId: string;
      if (existing) {
        const prev = Array.isArray(existing.mesajlar)
          ? (existing.mesajlar as unknown as StoredMessage[])
          : [];
        const updated = await db.konusma.update({
          where: { id: existing.id },
          data: { mesajlar: [...prev, ...turn] as unknown as object },
        });
        conversationId = updated.id;
      } else {
        const created = await db.konusma.create({
          data: {
            leadId: lead.id,
            kanal: opts.channel,
            mesajlar: turn as unknown as object,
          },
        });
        conversationId = created.id;
      }

      await db.lead.update({
        where: { id: lead.id },
        data: { sonYhteysAika: new Date() },
      });

      return { saved: true, leadId: lead.id, conversationId };
    },
    { saved: false },
    "appendConversationTurn",
  );
}
