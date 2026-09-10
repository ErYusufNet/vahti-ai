import type Anthropic from "@anthropic-ai/sdk";
import { createCalendarEvent } from "@/lib/integrations/google-calendar";
import { withDb } from "@/lib/db";

/**
 * Görev 2 + 6 — agentin työkalut.
 * "create_appointment" kutsuu OIKEAA Google Calendar -integraatiota
 * (lib/integrations/google-calendar.ts). Ilman avaimia se palauttaa
 * demo-tapahtuman eikä kaada.
 */
export const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "create_appointment",
    description:
      "Luo ajanvaraus potilaalle klinikan kalenteriin (Google Calendar). " +
      "Käytä vasta, kun potilas on vahvistanut hoidon, päivämäärän ja kellonajan.",
    input_schema: {
      type: "object",
      properties: {
        potilaanNimi: { type: "string", description: "Potilaan koko nimi" },
        palvelu: {
          type: "string",
          description: "Varattava hoito, esim. 'implanttiarvio'",
        },
        paiva: { type: "string", description: "Päivämäärä YYYY-MM-DD" },
        kellonaika: { type: "string", description: "Kellonaika HH:mm (24 h)" },
        kestoMinuuttia: {
          type: "number",
          description: "Käynnin kesto minuutteina (oletus 45)",
        },
        yhteystieto: {
          type: "string",
          description: "Potilaan puhelin tai sähköposti, jos tiedossa",
        },
      },
      required: ["potilaanNimi", "palvelu", "paiva", "kellonaika"],
    },
  },
];

export type AppointmentInput = {
  potilaanNimi: string;
  palvelu: string;
  paiva: string;
  kellonaika: string;
  kestoMinuuttia?: number;
  yhteystieto?: string;
};

export async function runTool(name: string, input: unknown): Promise<unknown> {
  switch (name) {
    case "create_appointment":
      return createAppointment(input as AppointmentInput);
    default:
      return { ok: false, error: `Tuntematon työkalu: ${name}` };
  }
}

async function createAppointment(input: AppointmentInput) {
  const startIso = `${input.paiva}T${input.kellonaika}:00`;
  const isEmail = !!input.yhteystieto?.includes("@");

  // 1) Oikea (tai demo) kalenteritapahtuma
  const event = await createCalendarEvent({
    summary: `${input.palvelu} — ${input.potilaanNimi}`,
    description: input.yhteystieto ? `Yhteystieto: ${input.yhteystieto}` : undefined,
    startIso,
    durationMin: input.kestoMinuuttia ?? 45,
    attendeeEmail: isEmail ? input.yhteystieto : undefined,
  });

  // 2) Paikallinen kopio tietokantaan (jos DB käytettävissä)
  await withDb(
    async (db) => {
      const klinik = await db.klinik.findFirst();
      if (!klinik) return;
      await db.appointment.create({
        data: {
          klinikId: klinik.id,
          potilaanNimi: input.potilaanNimi,
          palvelu: input.palvelu,
          alkaa: new Date(startIso),
          yhteystieto: input.yhteystieto ?? null,
          calendarEventId: event.mode === "google" ? event.id : null,
          lahde: "agent",
        },
      });
    },
    undefined,
    "create_appointment",
  );

  console.log("[tool:create_appointment]", { ...input, event });

  return {
    ok: true,
    vahvistusnumero: event.id,
    kalenteri: event.mode, // "google" = viety oikeaan kalenteriin, "mock" = demo
    linkki: event.htmlLink,
    viesti: `Ajanvaraus vahvistettu: ${input.palvelu} ${input.paiva} klo ${input.kellonaika}.`,
  };
}
