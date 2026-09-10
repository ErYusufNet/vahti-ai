import { getTranslations } from "next-intl/server";
import { clinic, users } from "@/lib/mock/data";
import { integrationStatus, env } from "@/lib/env";
import { isDbAvailable } from "@/lib/db";
import { getBackupNumber } from "@/lib/callbacks";
import { ShareLinkCard } from "@/components/dashboard/ShareLinkCard";
import { BackupNumberForm } from "@/components/dashboard/BackupNumberForm";

/** Asetukset — klinikan tiedot ja tiimi (mock, lukutila). */
export default async function SettingsPage() {
  const t = await getTranslations("Settings");

  const fields = [
    { label: t("fieldName"), value: clinic.ad },
    { label: t("fieldEmail"), value: clinic.email },
    { label: t("fieldPhone"), value: clinic.telefon },
    { label: t("fieldCity"), value: clinic.sehir },
    { label: t("fieldCountry"), value: clinic.ulke },
    { label: t("fieldSector"), value: clinic.sektor },
    { label: t("fieldAiLanguage"), value: clinic.aiDili },
    { label: t("fieldTimezone"), value: clinic.saatDilimi },
    { label: t("fieldPlan"), value: clinic.plan },
  ];

  const st = integrationStatus();
  const integrations: { name: string; live: boolean; task: string }[] = [
    { name: "PostgreSQL / Prisma", live: await isDbAvailable(), task: "1,5,7,8,9" },
    { name: "Claude (Anthropic)", live: st.anthropic, task: "2" },
    { name: "WhatsApp Cloud API", live: st.whatsapp, task: "5" },
    { name: "Google Calendar", live: st.googleCalendar, task: "6" },
    { name: "Embeddings (RAG)", live: st.embeddings, task: "7" },
    { name: "Twilio (puhelut)", live: st.twilio, task: "9" },
    { name: "Deepgram (STT)", live: st.deepgram, task: "9" },
    { name: "ElevenLabs (TTS)", live: st.elevenlabs, task: "9" },
  ];

  const backupNumber = await getBackupNumber();
  const dbUp = await isDbAvailable();

  const roleLabel = (r: string) =>
    r === "omistaja"
      ? t("roleOmistaja")
      : r === "vastaanotto"
        ? t("roleVastaanotto")
        : t("roleHoitaja");

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      <div className="notice" style={{ marginBottom: "1.2rem" }}>
        {t("readonlyNotice")}
      </div>

      <div className="card" style={{ marginBottom: "1.2rem" }}>
        <div className="section-title">{t("generalTitle")}</div>
        <div className="form-grid">
          {fields.map((f) => (
            <div className="field" key={f.label}>
              <label>{f.label}</label>
              <input defaultValue={f.value} readOnly />
            </div>
          ))}
        </div>
      </div>

      {/* GÖREV B — jaettava puhelulinkki + QR */}
      <div className="card" style={{ marginBottom: "1.2rem" }}>
        <div className="section-title">{t("shareTitle")}</div>
        <p className="dash-page-sub">{t("shareSub")}</p>
        <ShareLinkCard slug={clinic.slug} baseUrl={env.appBaseUrl()} />
      </div>

      {/* GÖREV C — PSTN-varayhteys */}
      <div className="card" style={{ marginBottom: "1.2rem" }}>
        <div className="section-title">{t("backupTitle")}</div>
        <p className="dash-page-sub">{t("backupSub")}</p>
        <BackupNumberForm
          initial={backupNumber ?? ""}
          canSave={dbUp}
          twilioConfigured={integrationStatus().twilio}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1.2rem" }}>
        <div style={{ padding: "1rem 1.1rem 0" }}>
          <div className="section-title">{t("integrationsTitle")}</div>
          <p className="dash-page-sub">{t("integrationsSub")}</p>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("colIntegration")}</th>
              <th>{t("colTask")}</th>
              <th>{t("colMode")}</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((i) => (
              <tr key={i.name}>
                <td>{i.name}</td>
                <td style={{ color: "var(--muted)" }}>Görev {i.task}</td>
                <td>
                  <span className={`pill ${i.live ? "pill--ok" : "pill--warn"}`}>
                    {i.live ? t("modeLive") : t("modeDemo")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.1rem 0" }}>
          <div className="section-title">{t("teamTitle")}</div>
          <p className="dash-page-sub">{t("teamRoutingNote")}</p>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("colMember")}</th>
              <th>{t("colEmail")}</th>
              <th>{t("colRole")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.ad}</td>
                <td>{u.email}</td>
                <td>
                  <span className="pill">{roleLabel(u.rol)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
