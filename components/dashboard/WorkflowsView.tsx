"use client";

import { Fragment, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Workflow } from "@/lib/mock/data";
import { timeAgo } from "@/lib/format";

type DryRun = { workflow: string; eligible: { isim: string; syy: string }[]; note: string };

export function WorkflowsView({ workflows }: { workflows: Workflow[] }) {
  const t = useTranslations("Workflows");
  const locale = useLocale();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, DryRun>>({});

  async function run(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: "POST" });
      const data: DryRun = await res.json();
      setResult((r) => ({ ...r, [id]: data }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="todo-box">
        <strong>{t("todoTitle")}:</strong> {t("todoBody")}
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
            {workflows.map((w) => (
              <Fragment key={w.id}>
                <tr>
                  <td>
                    <strong>{w.nimi}</strong>
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
                  <td>
                    <button
                      className="btn btn--ghost"
                      onClick={() => run(w.id)}
                      disabled={busyId === w.id}
                      style={{ fontSize: ".78rem", padding: ".3rem .6rem" }}
                    >
                      {t("runNow")}
                    </button>
                  </td>
                </tr>
                {result[w.id] && (
                  <tr>
                    <td colSpan={6} style={{ background: "var(--bg)" }}>
                      <div style={{ fontSize: ".82rem" }}>
                        <strong>{result[w.id].eligible.length}</strong>{" "}
                        {result[w.id].eligible.map((e) => e.isim).join(", ") || "—"}
                        <div style={{ color: "var(--muted)", marginTop: 2 }}>
                          {result[w.id].note}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
