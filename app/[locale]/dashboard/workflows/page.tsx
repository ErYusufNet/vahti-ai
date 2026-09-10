import { getTranslations } from "next-intl/server";
import { WorkflowsView } from "@/components/dashboard/WorkflowsView";
import { workflows } from "@/lib/mock/data";

/**
 * Görev 8 (UI) — /dashboard/workflows
 * Automaatioiden lista + kuivaharjoitus. Oikea ajastin/jono puuttuu
 * (ks. lib/workflows/engine.ts).
 */
export default async function WorkflowsPage() {
  const t = await getTranslations("Workflows");
  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>
      <WorkflowsView workflows={workflows} />
    </div>
  );
}
