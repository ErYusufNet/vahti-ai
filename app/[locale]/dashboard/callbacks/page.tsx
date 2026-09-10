import { getTranslations, getLocale } from "next-intl/server";
import { listCallbackRequests } from "@/lib/callbacks";
import { timeAgo } from "@/lib/format";

/**
 * GÖREV A + E — /dashboard/callbacks
 * Selaimen puhelu-widgetin fallback-lomakkeesta jätetyt yhteydenottopyynnöt.
 * Näyttää round-robinilla jaetun vastuuhenkilön (GÖREV E).
 */
export default async function CallbacksPage() {
  const t = await getTranslations("Callbacks");
  const locale = await getLocale();
  const { rows, backend } = await listCallbackRequests();

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      {backend === "mock" && (
        <div className="notice" style={{ marginBottom: "1rem" }}>
          {t("mockNote")}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("colName")}</th>
              <th>{t("colContact")}</th>
              <th>{t("colSubject")}</th>
              <th>{t("colSource")}</th>
              <th>{t("colAssignee")}</th>
              <th>{t("colStatus")}</th>
              <th>{t("colTime")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                  {t("empty")}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.nimi}</strong>
                  <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                    {r.viesti.length > 60 ? `${r.viesti.slice(0, 60)}…` : r.viesti}
                  </div>
                </td>
                <td style={{ fontSize: ".83rem" }}>
                  {r.puhelin ?? "—"}
                  {r.email && (
                    <div style={{ color: "var(--muted)" }}>{r.email}</div>
                  )}
                </td>
                <td style={{ fontSize: ".85rem" }}>{r.aihe ?? "—"}</td>
                <td>
                  <span className="pill pill--accent">
                    {r.lahde === "call-link" ? t("srcLink") : t("srcWidget")}
                  </span>
                </td>
                <td style={{ fontSize: ".85rem" }}>{r.assignedToNimi ?? "—"}</td>
                <td>
                  <span
                    className={`pill ${r.tila === "kasitelty" ? "pill--ok" : "pill--warn"}`}
                  >
                    {r.tila === "kasitelty" ? t("statusDone") : t("statusNew")}
                  </span>
                </td>
                <td style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                  {timeAgo(r.createdAt, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
