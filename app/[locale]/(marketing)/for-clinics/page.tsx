import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { Faq } from "@/components/marketing/Faq";
import {
  IconClock,
  IconRepeat,
  IconCalendarX,
  IconArchive,
} from "@/components/marketing/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ForClinics");
  return { title: `${t("eyebrow")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV B — /[locale]/for-clinics : sektöre özel iniş sayfası */
export default async function ForClinicsPage() {
  const t = await getTranslations("ForClinics");

  const pains = [
    { Icon: IconClock, title: t("pain1Title"), desc: t("pain1Desc") },
    { Icon: IconRepeat, title: t("pain2Title"), desc: t("pain2Desc") },
    { Icon: IconCalendarX, title: t("pain3Title"), desc: t("pain3Desc") },
    { Icon: IconArchive, title: t("pain4Title"), desc: t("pain4Desc") },
  ];

  const chat = [
    { who: "patient", text: t("chatPatient1") },
    { who: "ai", text: t("chatAi1") },
    { who: "patient", text: t("chatPatient2") },
    { who: "ai", text: t("chatAi2") },
    { who: "patient", text: t("chatPatient3") },
    { who: "ai", text: t("chatAi3") },
  ];

  const proofs = [1, 2, 3].map((n) => ({
    metric: t(`proof${n}Metric` as "proof1Metric"),
    label: t(`proof${n}Label` as "proof1Label"),
    quote: t(`proof${n}Quote` as "proof1Quote"),
    who: t(`proof${n}Who` as "proof1Who"),
  }));

  const clinics = [
    t("clinicDental"),
    t("clinicAesthetic"),
    t("clinicHair"),
    t("clinicPhysio"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="mkt-hero mkt-hero--short">
        <div className="mkt-hero__grid" aria-hidden />
        <span className="mkt-orb mkt-orb--1" aria-hidden />
        <div className="mkt-shell mkt-hero__body mkt-hero__body--short">
          <span className="mkt-eyebrow" style={{ color: "var(--accent-2)" }}>
            {t("eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>{t("title")}</h1>
          <p className="mkt-hero__sub">{t("subtitle")}</p>
          <div className="mkt-hero__cta">
            <Link href="/signup" className="mkt-btn mkt-btn--primary">
              {t("cta")}
            </Link>
            <Link href="/pricing" className="mkt-btn mkt-btn--ghost">
              {t("ctaSecondary")}
            </Link>
          </div>
          <p style={{ marginTop: "1.6rem", fontSize: "0.85rem", color: "var(--on-dark-muted)" }}>
            {t("clinicsIntro")} {clinics.join(" · ")}
          </p>
        </div>
      </section>

      {/* Acı noktaları */}
      <section className="mkt-section">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("painTitle")}</h2>
            <p className="mkt-section__sub">{t("painSubtitle")}</p>
          </Reveal>
          <div className="mkt-cards mkt-cards--4">
            {pains.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80} className="mkt-card mkt-card--pain">
                <div className="mkt-card__icon mkt-card__icon--warn">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI konuşma örneği */}
      <section className="mkt-section" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("howTitle")}</h2>
            <p className="mkt-section__sub">{t("howSubtitle")}</p>
          </Reveal>
          <Reveal className="mkt-chat" as="div">
            <div className="mkt-chat__head">
              <span className="mkt-chat__dot" /> WhatsApp · Hammasklinikka Aurora
            </div>
            {chat.map((m, i) => (
              <div key={i} className={`mkt-bubble mkt-bubble--${m.who}`}>
                {m.text}
              </div>
            ))}
            <div className="mkt-chat__meta">{t("chatMeta")}</div>
          </Reveal>
        </div>
      </section>

      {/* Testimonial'lar */}
      <section className="mkt-section">
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("proofTitle")}</h2>
            <p className="mkt-section__sub">{t("proofSubtitle")}</p>
          </Reveal>
          <div className="mkt-cards mkt-cards--3">
            {proofs.map((p, i) => (
              <Reveal key={i} delay={i * 90} className="mkt-card mkt-testi">
                <div className="mkt-testi__metric">{p.metric}</div>
                <div className="mkt-testi__label">{p.label}</div>
                <p className="mkt-testi__quote">“{p.quote}”</p>
                <div className="mkt-testi__who">{p.who}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UKK */}
      <section className="mkt-section" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell mkt-shell--narrow">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("faqTitle")}</h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* CTA-nauha */}
      <section className="mkt-band">
        <div className="mkt-shell mkt-band__inner">
          <div>
            <h2>{t("bandTitle")}</h2>
            <p>{t("bandDesc")}</p>
          </div>
          <Link href="/dashboard" className="mkt-btn mkt-btn--light">
            {t("bandCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
