import { getTranslations } from "next-intl/server";
import { clinic, users } from "@/lib/mock/data";

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

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.1rem 0" }}>
          <div className="section-title">{t("teamTitle")}</div>
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
