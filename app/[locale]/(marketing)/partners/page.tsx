import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/marketing/Reveal";
import { PartnerForm } from "@/components/marketing/PartnerForm";
import { IconMegaphone, IconCrm, IconLayers } from "@/components/marketing/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Partners");
  return { title: `${t("eyebrow")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV B — /[locale]/partners : kumppani-/bayi-ohjelma */
export default async function PartnersPage() {
  const t = await getTranslations("Partners");

  const stats = [
    { v: t("commissionValue"), l: t("commissionLabel") },
    { v: t("payoutValue"), l: t("payoutLabel") },
    { v: t("cookieValue"), l: t("cookieLabel") },
  ];
  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];
  const audiences = [
    { Icon: IconMegaphone, title: t("for1Title"), desc: t("for1Desc") },
    { Icon: IconCrm, title: t("for2Title"), desc: t("for2Desc") },
    { Icon: IconLayers, title: t("for3Title"), desc: t("for3Desc") },
  ];

  return (
    <>
      <section className="mkt-hero mkt-hero--short">
        <div className="mkt-hero__grid" aria-hidden />
        <span className="mkt-orb mkt-orb--1" aria-hidden />
        <span className="mkt-orb mkt-orb--2" aria-hidden />
        <div className="mkt-shell mkt-hero__body mkt-hero__body--short">
          <span className="mkt-eyebrow" style={{ color: "var(--accent-2)" }}>
            {t("eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>{t("title")}</h1>
          <p className="mkt-hero__sub">{t("subtitle")}</p>
          <div className="mkt-hero__cta">
            <a href="#hae" className="mkt-btn mkt-btn--primary">
              {t("cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="mkt-stats">
        <div className="mkt-shell">
          <div className="mkt-stats__grid">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 90} className="mkt-stat">
                <div className="mkt-stat__value">{s.v}</div>
                <div className="mkt-stat__label">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("howTitle")}</h2>
          </Reveal>
          <div className="mkt-steps">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90} className="mkt-step">
                <div className="mkt-step__num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("forTitle")}</h2>
          </Reveal>
          <div className="mkt-cards mkt-cards--3">
            {audiences.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80} className="mkt-card">
                <div className="mkt-card__icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section" id="hae">
        <div className="mkt-shell mkt-shell--narrow">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("formTitle")}</h2>
          </Reveal>
          <Reveal>
            <PartnerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
