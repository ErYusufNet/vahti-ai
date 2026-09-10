import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { RevenueCalculator } from "@/components/marketing/RevenueCalculator";
import { PricingTable } from "@/components/marketing/PricingTable";
import {
  IconPhone,
  IconChat,
  IconCrm,
  IconGlobe,
  IconWhatsApp,
  IconWindow,
  IconOutbound,
} from "@/components/marketing/icons";

export default async function LandingPage() {
  const t = await getTranslations("Landing");
  const tp = await getTranslations("Pricing");

  const features = [
    { Icon: IconPhone, title: t("features.voiceTitle"), desc: t("features.voiceDesc") },
    { Icon: IconChat, title: t("features.chatTitle"), desc: t("features.chatDesc") },
    { Icon: IconCrm, title: t("features.crmTitle"), desc: t("features.crmDesc") },
    { Icon: IconGlobe, title: t("features.multilangTitle"), desc: t("features.multilangDesc") },
  ];

  const channels = [
    { Icon: IconPhone, title: t("channels.voiceTitle"), desc: t("channels.voiceDesc") },
    { Icon: IconWhatsApp, title: t("channels.whatsappTitle"), desc: t("channels.whatsappDesc") },
    { Icon: IconWindow, title: t("channels.webchatTitle"), desc: t("channels.webchatDesc") },
    { Icon: IconOutbound, title: t("channels.outboundTitle"), desc: t("channels.outboundDesc") },
  ];

  const stats = [
    { value: t("stats.messagesValue"), label: t("stats.messagesLabel") },
    { value: t("stats.patientsValue"), label: t("stats.patientsLabel") },
    { value: t("stats.bookingsValue"), label: t("stats.bookingsLabel") },
  ];

  const steps = [
    { title: t("steps.step1Title"), desc: t("steps.step1Desc") },
    { title: t("steps.step2Title"), desc: t("steps.step2Desc") },
    { title: t("steps.step3Title"), desc: t("steps.step3Desc") },
  ];

  return (
    <>
      {/* 2 — HERO */}
      <section className="mkt-hero">
        <div className="mkt-hero__grid" aria-hidden />
        <span className="mkt-orb mkt-orb--1" aria-hidden />
        <span className="mkt-orb mkt-orb--2" aria-hidden />
        <span className="mkt-orb mkt-orb--3" aria-hidden />
        <div className="mkt-shell mkt-hero__body">
          <span className="mkt-badge">{t("hero.badge")}</span>
          <h1>{t("hero.title")}</h1>
          <p className="mkt-hero__sub">{t("hero.subtitle")}</p>
          <div className="mkt-hero__cta">
            <Link href="/dashboard" className="mkt-btn mkt-btn--primary">
              {t("hero.ctaPrimary")}
            </Link>
            <a href="#features" className="mkt-btn mkt-btn--ghost">
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* 3 — TILASTONAUHA */}
      <section className="mkt-stats">
        <div className="mkt-shell">
          <div className="mkt-stats__grid">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="mkt-stat">
                <div className="mkt-stat__value">{s.value}</div>
                <div className="mkt-stat__label">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — MITÄ ME TEEMME */}
      <section className="mkt-section" id="features">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <div className="mkt-eyebrow">Vahti AI</div>
            <h2>{t("features.title")}</h2>
            <p className="mkt-section__sub">{t("features.subtitle")}</p>
          </Reveal>
          <div className="mkt-cards mkt-cards--4">
            {features.map(({ Icon, title, desc }, i) => (
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

      {/* 5 — KANAVAT */}
      <section className="mkt-section" id="channels" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("channels.title")}</h2>
            <p className="mkt-section__sub">{t("channels.subtitle")}</p>
          </Reveal>
          <div className="mkt-cards mkt-cards--4">
            {channels.map(({ Icon, title, desc }, i) => (
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

      {/* 6 — TULONMENETYSLASKURI */}
      <section className="mkt-section mkt-calc">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("calc.title")}</h2>
            <p className="mkt-section__sub" style={{ color: "var(--on-dark-muted)" }}>
              {t("calc.subtitle")}
            </p>
          </Reveal>
          <Reveal>
            <RevenueCalculator />
          </Reveal>
        </div>
      </section>

      {/* 7 — 5 MINUUTISSA LIVE */}
      <section className="mkt-section">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("steps.title")}</h2>
            <p className="mkt-section__sub">{t("steps.subtitle")}</p>
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

      {/* 8 — HINNOITTELU (jaettu taulukko, tiivistetty) */}
      <section className="mkt-section" id="pricing" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{tp("title")}</h2>
            <p className="mkt-section__sub">{tp("subtitle")}</p>
          </Reveal>
          <Reveal>
            <PricingTable featuredOnly />
          </Reveal>
          <Reveal className="mkt-section__head--center" as="div">
            <p className="mkt-section__sub" style={{ marginTop: "1.4rem" }}>
              <Link href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>
                {tp("comparisonTitle")} →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
