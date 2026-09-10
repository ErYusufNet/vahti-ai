import { getTranslations } from "next-intl/server";
import { TestChat } from "@/components/dashboard/TestChat";
import { KnowledgeManager } from "@/components/dashboard/KnowledgeManager";

/**
 * Görev 7 — /dashboard/ai-assistant
 * Tietopankki (DB + pgvector-haku, mock-fallback) + agentin testinäyttö.
 */
export default async function AiAssistantPage() {
  const t = await getTranslations("AiAssistant");

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      <div className="ai-layout">
        <div className="card">
          <KnowledgeManager />
        </div>
        <div className="card">
          <TestChat />
        </div>
      </div>
    </div>
  );
}
