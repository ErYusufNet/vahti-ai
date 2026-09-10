import { getTranslations } from "next-intl/server";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";
import { leads } from "@/lib/mock/data";

/** Görev 4 — /dashboard/pipeline: sürükle-bırak kanban. */
export default async function PipelinePage() {
  const t = await getTranslations("Pipeline");
  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">
        {t("subtitle")} · <span style={{ fontSize: ".85em" }}>{t("resetHint")}</span>
      </p>
      <PipelineBoard leads={leads} />
    </div>
  );
}
