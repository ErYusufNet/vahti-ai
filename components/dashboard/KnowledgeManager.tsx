"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

type KbRow = {
  id: string;
  palvelu: string;
  kategoria: string;
  hinta: string;
  kesto: string;
  tiedot: string;
  embedded?: boolean;
};
type ApiResp = {
  rows: KbRow[];
  backend: "db" | "mock";
  dbAvailable: boolean;
  embeddings: boolean;
};

const EMPTY_FORM = { palvelu: "", kategoria: "", hinta: "", kesto: "", tiedot: "" };

/** Görev 7 — tietopankin hallinta: haku (vektorihaku/avainsana), lisäys, uudelleenindeksointi. */
export function KnowledgeManager() {
  const t = useTranslations("AiAssistant");
  const [data, setData] = useState<ApiResp | null>(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (query: string) => {
    const res = await fetch(`/api/knowledge?q=${encodeURIComponent(query)}`);
    setData(await res.json());
  }, []);

  useEffect(() => {
    // Kertahaku mountissa. setState tapahtuu vasta fetchin awaitin jälkeen,
    // joten se ei ole synkroninen (sääntö ei tunnista async-kutsua).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load("");
  }, [load]);

  async function add() {
    if (!form.palvelu.trim() || !form.tiedot.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (j.ok) {
        setMsg(
          j.embedded ? t("kbAddedEmbedded") : t("kbAddedNoEmbed"),
        );
        setForm(EMPTY_FORM);
        load(q);
      } else {
        setMsg(j.error ?? "Virhe");
      }
    } finally {
      setBusy(false);
    }
  }

  async function reindex() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/knowledge/reindex", { method: "POST" });
      const j = await res.json();
      setMsg(
        j.ok
          ? `${t("reindexDone")}: +${j.seeded} / embed ${j.embedded} / ${j.skipped} ${t("skipped")}. ${j.note ?? ""}`
          : (j.note ?? "Virhe"),
      );
      load(q);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="section-title">{t("kbTitle")}</div>
      <p className="dash-page-sub" style={{ marginBottom: ".6rem" }}>
        {t("kbSubtitle")}
      </p>

      <div
        className={`notice ${data?.backend === "db" ? "notice--accent" : ""}`}
        style={{ marginBottom: ".7rem" }}
      >
        {data
          ? data.backend === "db"
            ? data.embeddings
              ? t("kbBackendVector")
              : t("kbBackendDbKeyword")
            : t("kbBackendMock")
          : t("kbLoading")}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: ".7rem" }}>
        <input
          className="field"
          style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 7, padding: ".4rem .6rem" }}
          placeholder={t("kbSearch")}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            load(e.target.value);
          }}
        />
        <button className="btn btn--ghost" onClick={reindex} disabled={busy}>
          {t("kbReindex")}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: ".9rem" }}>
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
            {(data?.rows ?? []).map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.palvelu}</strong>
                  <div style={{ fontSize: ".74rem", color: "var(--muted)" }}>
                    {r.kesto}
                    {r.embedded ? " · ✓ embed" : ""}
                  </div>
                </td>
                <td>
                  <span className="pill">{r.kategoria}</span>
                </td>
                <td>{r.hinta || "—"}</td>
                <td style={{ fontSize: ".8rem", color: "var(--muted)", maxWidth: 280 }}>
                  {r.tiedot}
                </td>
              </tr>
            ))}
            {data && data.rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: "var(--muted)", fontSize: ".85rem" }}>
                  {t("kbEmpty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details>
        <summary style={{ cursor: "pointer", fontSize: ".85rem", fontWeight: 600 }}>
          {t("kbAdd")}
        </summary>
        <div className="form-grid" style={{ marginTop: ".7rem" }}>
          {(
            [
              ["palvelu", t("kbService")],
              ["kategoria", t("kbCategory")],
              ["hinta", t("kbPrice")],
              ["kesto", t("kbDuration")],
            ] as const
          ).map(([k, label]) => (
            <div className="field" key={k}>
              <label>{label}</label>
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          ))}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>{t("kbInfo")}</label>
            <input
              value={form.tiedot}
              onChange={(e) => setForm({ ...form, tiedot: e.target.value })}
            />
          </div>
        </div>
        <button className="btn" onClick={add} disabled={busy} style={{ marginTop: ".6rem" }}>
          {t("kbAdd")}
        </button>
      </details>

      {msg && (
        <div className="notice" style={{ marginTop: ".7rem" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
