"use client";

import { Fragment, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Workflow } from "@/lib/mock/data";
import { IMPLEMENTED_WORKFLOWS } from "@/lib/mock/data";
import { timeAgo } from "@/lib/format";

type RunResult = {
  workflowNimi: string;
  dryRun: boolean;
  backend: "db" | "mock";
  matched: { kohde: string; syy: string; kanava: string; toimitus?: string }[];
  sent: number;
  note?: string;
};

export function WorkflowsView({ workflows }: { workflows: Workflow[] }) {
  const t = useTranslations("Workflows");
  const locale = useLocale();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, RunResult>>({});

  async function run(id: string, dryRun: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/workflows/${id}/run${dryRun ? "?dryRun=true" : ""}`,
        { method: "POST" },
      );
      const json: RunResult = await res.json();
      setResult((r) => ({ ...r, [id]: json }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="todo-box">
        <strong>{t("engineTitle")}:</strong> {t("engineBody")}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("colName")}</th>
              <th>{t("colTrigger")}</th>
              <th>{t("colStatus")}</th>
              <th>{t("colRuns")}</th>
              <th>{t("colLastRun")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {workflows.map((w) => {
              const impl = IMPLEMENTED_WORKFLOWS.has(w.id);
              const r = result[w.id];
              return (
                <Fragment key={w.id}>
                  <tr>
                    <td>
                      <strong>{w.nimi}</strong>
                      {!impl && (
                        <span className="pill" style={{ marginLeft: 6 }}>
                          TODO
                        </span>
                      )}
                      <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                        {w.kuvaus}
                      </div>
                    </td>
                    <td style={{ fontSize: ".83rem" }}>{w.liipaisin}</td>
                    <td>
                      <span
                        className={`pill ${w.tila === "aktiivinen" ? "pill--ok" : "pill--muted"}`}
                      >
                        {w.tila === "aktiivinen"
                          ? t("statusAktiivinen")
                          : t("statusLuonnos")}
                      </span>
                    </td>
                    <td>{w.ajokerrat}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                      {w.viimeinenAjo ? timeAgo(w.viimeinenAjo, locale) : t("never")}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn--ghost"
                        onClick={() => run(w.id, true)}
                        disabled={!impl || busyId === w.id}
                        style={{ fontSize: ".76rem", padding: ".3rem .5rem", marginRight: 4 }}
                      >
                        {t("dryRun")}
                      </button>
                      <button
                        className="btn"
                        onClick={() => run(w.id, false)}
                        disabled={!impl || busyId === w.id}
                        style={{ fontSize: ".76rem", padding: ".3rem .5rem" }}
                      >
                        {t("runNow")}
                      </button>
                    </td>
                  </tr>
                  {r && (
                    <tr>
                      <td colSpan={6} style={{ background: "var(--bg)" }}>
                        <div style={{ fontSize: ".82rem" }}>
                          <strong>
                            {r.matched.length} {t("matched")}
                          </strong>
                          {" · "}
                          {r.dryRun ? t("wasDryRun") : `${r.sent} ${t("sent")}`}
                          {" · "}
                          <span className="pill">{r.backend}</span>
                          {r.matched.length > 0 && (
                            <ul style={{ margin: "4px 0 0 1rem" }}>
                              {r.matched.slice(0, 8).map((m, i) => (
                                <li key={i}>
                                  {m.kohde} — <em>{m.syy}</em> ({m.kanava}
                                  {m.toimitus ? ` → ${m.toimitus}` : ""})
                                </li>
                              ))}
                            </ul>
                          )}
                          {r.note && (
                            <div style={{ color: "var(--muted)", marginTop: 4 }}>
                              {r.note}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
