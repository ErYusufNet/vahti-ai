import { getTranslations } from "next-intl/server";
import { TestChat } from "@/components/dashboard/TestChat";
import { knowledgeBase } from "@/lib/mock/data";

/**
 * Görev 7 (UI) — /dashboard/ai-assistant
 * Tietopankki (RAG-lähde) + agentin testinäyttö.
 * TODO: oikea RAG (pgvector + embeddingit) — ks. lib/rag/index.ts.
 * CRUD-toiminnot ovat vielä lukutilassa (mock-data).
 */
export default async function AiAssistantPage() {
  const t = await getTranslations("AiAssistant");

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      <div className="todo-box">
        <strong>TODO (Görev 7):</strong> Tietopankki toimii nyt system-promptin
        koko sisältönä. Oikea RAG (tekstin pilkkominen → embeddingit → pgvector →
        top-5 osuvinta) on hahmoteltu tiedostossa <code>lib/rag/index.ts</code>.
      </div>

      <div className="ai-layout">
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.1rem 0" }}>
            <div className="section-title">{t("kbTitle")}</div>
            <p className="dash-page-sub">{t("kbSubtitle")}</p>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>{t("kbService")}</th>
                <th>{t("kbCategory")}</th>
                <th>{t("kbPrice")}</th>
                <th>{t("kbInfo")}</th>
              </tr>
            </thead>
            <tbody>
              {knowledgeBase.map((k) => (
                <tr key={k.id}>
                  <td>
                    <strong>{k.palvelu}</strong>
                    <div style={{ fontSize: ".76rem", color: "var(--muted)" }}>
                      {k.kesto}
                    </div>
                  </td>
                  <td>
                    <span className="pill">{k.kategoria}</span>
                  </td>
                  <td>{k.hinta}</td>
                  <td style={{ fontSize: ".82rem", color: "var(--muted)", maxWidth: 320 }}>
                    {k.tiedot}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <TestChat />
        </div>
      </div>
    </div>
  );
}
