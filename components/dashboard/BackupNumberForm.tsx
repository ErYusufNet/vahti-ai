"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** GÖREV C — PSTN-varayhteysnumero. Tallennus vaatii tietokannan. */
export function BackupNumberForm({
  initial,
  canSave,
  twilioConfigured,
}: {
  initial: string;
  canSave: boolean;
  twilioConfigured: boolean;
}) {
  const t = useTranslations("Settings");
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await fetch("/api/settings/backup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ number: value }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field" style={{ maxWidth: 380 }}>
      <label>{t("backupLabel")}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="+358 …"
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={save} disabled={busy}>
          {busy ? "…" : t("backupSave")}
        </button>
      </div>
      {saved && (
        <div className="notice notice--accent" style={{ marginTop: 8 }}>
          {canSave ? t("backupSaved") : t("backupDemoNote")}
        </div>
      )}
      <div className="notice" style={{ marginTop: 8 }}>
        {twilioConfigured ? t("backupTwilioOn") : t("backupTwilioTodo")}
      </div>
    </div>
  );
}
