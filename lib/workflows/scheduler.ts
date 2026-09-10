/**
 * Görev 8 — node-cron-ajastin. Rekisteröidään kerran palvelimen käynnistyessä
 * (instrumentation.ts). Ajaa aktiiviset työnkulut aikataulun mukaan.
 */
import cron, { type ScheduledTask } from "node-cron";
import { WORKFLOW_DEFS } from "./definitions";
import { runWorkflow } from "./runner";

let started = false;
const tasks: ScheduledTask[] = [];

export function startScheduler(): void {
  if (started) return;
  started = true;

  for (const def of WORKFLOW_DEFS) {
    if (!def.aktiivinen) {
      console.log(`[cron] "${def.nimi}" on luonnos — ei aikataulutettu.`);
      continue;
    }
    if (!cron.validate(def.cron)) {
      console.warn(`[cron] virheellinen aikataulu työnkululle ${def.id}: ${def.cron}`);
      continue;
    }
    const task = cron.schedule(
      def.cron,
      async () => {
        try {
          const res = await runWorkflow(def.id, { dryRun: false });
          console.log(
            `[cron] ${def.nimi}: ${res.matched.length} osumaa, ${res.sent} lähetetty (${res.backend}).`,
          );
        } catch (err) {
          console.error(`[cron] ${def.nimi} epäonnistui:`, err);
        }
      },
      { timezone: "Europe/Helsinki" },
    );
    tasks.push(task);
    console.log(`[cron] aikataulutettu "${def.nimi}" (${def.cron}).`);
  }
}

export function stopScheduler(): void {
  tasks.forEach((t) => t.stop());
  tasks.length = 0;
  started = false;
}
