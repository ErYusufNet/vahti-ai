/**
 * Görev 8 — työnkulun suoritin.
 *
 * `runWorkflow(id, { dryRun })`:
 *  - DB käytettävissä → hakee ehdot täyttävät liidit/ajanvaraukset ja
 *    lähettää viestin WhatsAppilla (jos numero + avain), muuten kirjaa lokin.
 *  - Ei DB:tä → simuloi mock-datalla (aina "dry run", sent = 0).
 *  - Kirjaa ajon WorkflowRun-tauluun (jos DB).
 */
import { withDb, isDbAvailable } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/integrations/whatsapp";
import { getWorkflowDef, messageFor } from "./definitions";
import {
  leads as MOCK_LEADS,
  conversations as MOCK_CONVS,
} from "@/lib/mock/data";

export type WorkflowRunResult = {
  workflowId: string;
  workflowNimi: string;
  dryRun: boolean;
  backend: "db" | "mock";
  matched: { kohde: string; syy: string; kanava: string; toimitus?: string }[];
  sent: number;
  note?: string;
};

const FOUR_HOURS = 4 * 3600_000;
const SIXTY_DAYS = 60 * 24 * 3600_000;

export async function runWorkflow(
  id: string,
  opts: { dryRun?: boolean } = {},
): Promise<WorkflowRunResult> {
  const def = getWorkflowDef(id);
  if (!def) {
    return {
      workflowId: id,
      workflowNimi: id,
      dryRun: true,
      backend: "mock",
      matched: [],
      sent: 0,
      note: "Tuntematon työnkulku",
    };
  }

  const dryRun = opts.dryRun ?? false;

  if (!(await isDbAvailable())) {
    return simulateWithMock(def.id, def.nimi);
  }

  const now = Date.now();
  const matched: WorkflowRunResult["matched"] = [];
  let sent = 0;

  if (def.id === "kuuma-seuranta") {
    const rows = await prisma.lead.findMany({
      where: {
        pipelineAsamasi: { in: ["kuuma", "arviointi"] },
        OR: [
          { sonYhteysAika: null },
          { sonYhteysAika: { lt: new Date(now - FOUR_HOURS) } },
        ],
      },
      take: 100,
    });
    for (const lead of rows) {
      const syy = "Vaihe kuuma/arviointi, ei kontaktia 4 h";
      const kanava = lead.puhelin ? "whatsapp" : "loki";
      let toimitus: string | undefined;
      if (!dryRun && lead.puhelin) {
        const r = await sendWhatsAppText(
          lead.puhelin,
          messageFor(def.id, (lead.dil as "fi" | "en") ?? "fi", {
            nimi: lead.isim ?? undefined,
          }),
        );
        toimitus = r.mode;
        if (r.mode === "live") sent++;
      }
      matched.push({ kohde: lead.isim ?? lead.id, syy, kanava, toimitus });
    }
  } else if (def.id === "ajanvaraus-muistutus") {
    const rows = await prisma.appointment.findMany({
      where: {
        muistutettu: false,
        alkaa: { gte: new Date(now), lte: new Date(now + 24 * 3600_000) },
      },
      take: 100,
    });
    for (const appt of rows) {
      const kanava = appt.yhteystieto?.includes("@") ? "sähköposti" : appt.yhteystieto ? "whatsapp" : "loki";
      let toimitus: string | undefined;
      if (!dryRun && appt.yhteystieto && !appt.yhteystieto.includes("@")) {
        const r = await sendWhatsAppText(
          appt.yhteystieto,
          messageFor(def.id, "fi", {
            palvelu: appt.palvelu,
            aika: appt.alkaa.toLocaleString("fi-FI"),
          }),
        );
        toimitus = r.mode;
        if (r.mode === "live") sent++;
      }
      if (!dryRun) {
        await prisma.appointment.update({
          where: { id: appt.id },
          data: { muistutettu: true },
        });
      }
      matched.push({
        kohde: `${appt.potilaanNimi} — ${appt.palvelu}`,
        syy: "Aika < 24 h",
        kanava,
        toimitus,
      });
    }
  } else if (def.id === "reaktivointi") {
    const rows = await prisma.lead.findMany({
      where: {
        pipelineAsamasi: { not: "ajanvaraus" },
        sonYhteysAika: { lt: new Date(now - SIXTY_DAYS) },
      },
      take: 100,
    });
    for (const lead of rows) {
      const kanava = lead.puhelin ? "whatsapp" : "loki";
      let toimitus: string | undefined;
      if (!dryRun && lead.puhelin) {
        const r = await sendWhatsAppText(
          lead.puhelin,
          messageFor(def.id, (lead.dil as "fi" | "en") ?? "fi", {
            nimi: lead.isim ?? undefined,
          }),
        );
        toimitus = r.mode;
        if (r.mode === "live") sent++;
      }
      matched.push({ kohde: lead.isim ?? lead.id, syy: "60 pv ilman kontaktia", kanava, toimitus });
    }
  }

  // Loki
  await withDb(
    (db) =>
      db.workflowRun.create({
        data: {
          workflowId: def.id,
          dryRun,
          matched: matched.length,
          sent,
          detail: { matched } as unknown as object,
        },
      }),
    undefined,
    "workflowRun-log",
  );

  return {
    workflowId: def.id,
    workflowNimi: def.nimi,
    dryRun,
    backend: "db",
    matched,
    sent,
    note:
      sent === 0 && !dryRun
        ? "Ei lähetettyjä viestejä (ei WhatsApp-avainta tai ei numeroita) — muuten toiminto suoritettu."
        : undefined,
  };
}

/** Ilman DB:tä: simulaatio mock-datasta. */
function simulateWithMock(id: string, nimi: string): WorkflowRunResult {
  let matched: WorkflowRunResult["matched"] = [];
  if (id === "kuuma-seuranta") {
    matched = MOCK_LEADS.filter((l) =>
      ["kuuma", "arviointi"].includes(l.pipelineAsamasi),
    ).map((l) => ({
      kohde: l.isim,
      syy: "Vaihe kuuma/arviointi",
      kanava: "simulaatio",
    }));
  } else if (id === "ajanvaraus-muistutus") {
    matched = MOCK_LEADS.filter((l) => l.pipelineAsamasi === "ajanvaraus").map((l) => ({
      kohde: l.isim,
      syy: "Tuleva aika",
      kanava: "simulaatio",
    }));
  } else if (id === "reaktivointi") {
    matched = MOCK_CONVS.slice(0, 2).map((c) => ({
      kohde: c.isim,
      syy: "Hiljainen liidi (simulaatio)",
      kanava: "simulaatio",
    }));
  }
  return {
    workflowId: id,
    workflowNimi: nimi,
    dryRun: true,
    backend: "mock",
    matched,
    sent: 0,
    note: "Tietokantaa ei ole — simulaatio mock-datalla. Aseta DATABASE_URL ja aja `npm run db:push`.",
  };
}
