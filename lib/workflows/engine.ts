/**
 * Görev 8 — automaatiomoottorin runko.
 *
 * TODO (oikea toteutus): tarvitaan ajastin ja jono. Vaihtoehdot:
 *   - node-cron (kevyt, sopii yhteen prosessiin) TAI
 *   - BullMQ + Redis (skaalautuva, uudelleenyritykset) → lisää .env:
 *       REDIS_URL=redis://localhost:6379
 * Ajastin kutsuisi runWorkflow():a säännöllisesti ja lähettäisi viestit
 * oikean kanavan kautta (WhatsApp/SMS). Nyt tämä on pelkkä KUIVAHARJOITUS:
 * se laskee kohteet mutta ei lähetä mitään.
 */
import { leads, conversations, workflows, type Workflow } from "@/lib/mock/data";

export type DryRunResult = {
  workflow: string;
  eligible: { leadId: string; isim: string; syy: string }[];
  sent: 0;
  note: string;
};

/** Palauttaa liidit, joihin työnkulku kohdistuisi (mock-logiikka). */
export function evaluateWorkflow(wf: Workflow): DryRunResult {
  let eligible: DryRunResult["eligible"] = [];

  switch (wf.id) {
    case "w1": // Ensikontaktisoitto → uudet liidit
      eligible = leads
        .filter((l) => l.pipelineAsamasi === "uusi")
        .map((l) => ({ leadId: l.id, isim: l.isim, syy: "Vaihe: uusi" }));
      break;
    case "w2": // Kuuma seuranta → viesti ilman AI-vastausta tuoreimpana
      eligible = conversations
        .filter((c) => c.viestit.at(-1)?.rooli === "potilas")
        .map((c) => ({ leadId: c.leadId, isim: c.isim, syy: "Odottaa vastausta" }));
      break;
    case "w3": // Ajanvarausmuistutus → varaus-vaiheen liidit
      eligible = leads
        .filter((l) => l.pipelineAsamasi === "ajanvaraus")
        .map((l) => ({ leadId: l.id, isim: l.isim, syy: "Tuleva aika" }));
      break;
    case "w6": // Reaktivointi → hoivaus-vaiheessa pitkään
      eligible = leads
        .filter((l) => l.pipelineAsamasi === "hoivaus")
        .map((l) => ({ leadId: l.id, isim: l.isim, syy: "Hiljainen liidi" }));
      break;
    default:
      eligible = [];
  }

  return {
    workflow: wf.nimi,
    eligible,
    sent: 0,
    note: "Kuivaharjoitus — viestejä ei lähetetty. Oikea lähetys vaatii ajastimen + kanavaintegraation.",
  };
}

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
