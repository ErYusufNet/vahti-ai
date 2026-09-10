import { getTranslations, getLocale } from "next-intl/server";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { overview, activity } from "@/lib/mock/data";
import { timeAgo } from "@/lib/format";

/** Görev 3 — /dashboard/overview */
export default async function OverviewPage() {
  const t = await getTranslations("Overview");
  const locale = await getLocale();

  const kpis = [
    { label: t("conversationsToday"), value: overview.tanaan.keskustelut },
    { label: t("activeLeads"), value: overview.tanaan.aktiivisetLiidit },
    { label: t("callsToday"), value: overview.tanaan.puhelut },
    { label: t("aiResolution"), value: `${overview.tekoalynRatkaisuprosentti} %` },
    { label: t("conversion"), value: `${overview.konversioprosentti} %` },
    {
      label: t("languages"),
      value: overview.kielijakauma.map((k) => `${k.kieli} ${k.osuus}%`).join(" · "),
      small: true,
    },
  ];

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi__label">{k.label}</div>
            <div
              className="kpi__value"
              style={k.small ? { fontSize: "1.05rem", fontWeight: 600 } : undefined}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">{t("chartTitle")}</div>
          <WeeklyChart />
        </div>

        <div className="card">
          <div className="section-title">{t("activityTitle")}</div>
          {activity.map((a) => (
            <div className="activity-item" key={a.id}>
              <span>{a.mita}</span>
              <span className="activity-item__meta">
                {a.kuka} · {timeAgo(a.aika, locale)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
