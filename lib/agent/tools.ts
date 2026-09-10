import type Anthropic from "@anthropic-ai/sdk";
import { createCalendarEvent } from "@/lib/integrations/google-calendar";

/**
 * Görev 2: agentin työkalut. Toistaiseksi vain "randevu_olustur", joka on
 * mock (ei kytketty oikeaan kalenteriin — se on Görev 6). Työkalu kirjaa
 * kutsun konsoliin ja palauttaa vahvistuksen.
 */
export const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "randevu_olustur",
    description:
      "Luo ajanvaraus potilaalle klinikan kalenteriin. Käytä tätä vasta, kun potilas on vahvistanut hoidon, päivämäärän ja kellonajan.",
    input_schema: {
      type: "object",
      properties: {
        potilaanNimi: { type: "string", description: "Potilaan koko nimi" },
        palvelu: {
          type: "string",
          description: "Varattava hoito, esim. 'implanttiarvio'",
        },
        paiva: { type: "string", description: "Päivämäärä muodossa YYYY-MM-DD" },
        kellonaika: { type: "string", description: "Kellonaika muodossa HH:mm" },
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
  yhteystieto?: string;
};

export function runTool(name: string, input: unknown): unknown {
  switch (name) {
    case "randevu_olustur":
      return createAppointmentMock(input as AppointmentInput);
    default:
      return { ok: false, error: `Tuntematon työkalu: ${name}` };
  }
}

function createAppointmentMock(input: AppointmentInput) {
  const event = createCalendarEvent({
    summary: `${input.palvelu} — ${input.potilaanNimi}`,
    date: input.paiva,
    time: input.kellonaika,
    contact: input.yhteystieto,
  });
  // Görev 2: "sadece log'lasın" — kirjataan kutsu palvelimen konsoliin.
  console.log("[tool:randevu_olustur] (mock) ajanvaraus luotu:", {
    ...input,
    event,
  });
  return {
    ok: true,
    vahvistusnumero: event.id,
    viesti: `Ajanvaraus vahvistettu: ${input.palvelu} ${input.paiva} klo ${input.kellonaika}.`,
    kalenteri: event.mode,
  };
}
