"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Call } from "@/lib/mock/data";
import { clock, scoreClass } from "@/lib/format";

export function CallsView({ calls }: { calls: Call[] }) {
  const t = useTranslations("Calls");
  const [selectedId, setSelectedId] = useState(calls[0]?.id ?? "");
  const selected = calls.find((c) => c.id === selectedId);

  const statusPill = (s: Call["tila"]) => {
    const cls =
      s === "vastattu" ? "pill pill--ok" : s === "kesken" ? "pill pill--warn" : "pill";
    const label =
      s === "vastattu"
        ? t("statusVastattu")
        : s === "kesken"
          ? t("statusKesken")
          : t("statusVastaamaton");
    return <span className={cls}>{label}</span>;
  };

  return (
    <div className="grid-2">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("colCaller")}</th>
              <th>{t("colDirection")}</th>
              <th>{t("colDuration")}</th>
              <th>{t("colStatus")}</th>
              <th>{t("colTime")}</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((c) => (
              <tr
                key={c.id}
                data-selected={c.id === selectedId}
                onClick={() => setSelectedId(c.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{c.soittaja}</td>
                <td>{c.suunta === "saapuva" ? t("dirSaapuva") : t("dirLahteva")}</td>
                <td>{c.kesto}</td>
                <td>{statusPill(c.tila)}</td>
                <td>{clock(c.aika)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        {!selected ? (
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{t("selectHint")}</p>
        ) : (
          <>
            <div className="section-title">{selected.soittaja}</div>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: ".8rem" }}>
              {selected.kasittelija} · {selected.kesto}
            </p>

            <div style={{ fontWeight: 600, fontSize: ".82rem", marginBottom: 4 }}>
              {t("summaryTitle")}
            </div>
            <p style={{ fontSize: ".86rem", marginBottom: "1rem" }}>{selected.yhteenveto}</p>

            {selected.kerätytTiedot.length > 0 && (
              <>
                <div style={{ fontWeight: 600, fontSize: ".82rem", marginBottom: 4 }}>
                  {t("collectedTitle")}
                </div>
                <ul style={{ fontSize: ".85rem", margin: "0 0 1rem 1rem" }}>
                  {selected.kerätytTiedot.map((k) => (
                    <li key={k.avain}>
                      <strong>{k.avain}:</strong> {k.arvo}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div style={{ fontWeight: 600, fontSize: ".82rem", marginBottom: 4 }}>
              {t("suggestionTitle")}
            </div>
            <p style={{ fontSize: ".86rem", marginBottom: "1rem" }}>{selected.ehdotus}</p>

            <div style={{ fontSize: ".85rem" }}>
              {t("leadScore")}:{" "}
              <span className={scoreClass(selected.leadSkoru)}>{selected.leadSkoru}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
