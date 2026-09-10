import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { RevenueCalculator } from "@/components/marketing/RevenueCalculator";
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

  const yes = <span className="yes">{t("pricing.yes")}</span>;
  const no = <span>{t("pricing.no")}</span>;

  // Hinnoittelurivit: [otsikko, Essential, Professional, Business, Enterprise]
  const rows: [string, React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode][] = [
    [t("pricing.rowConversations"), t("pricing.valConvE"), t("pricing.valConvP"), t("pricing.valConvB"), t("pricing.valConvX")],
    [t("pricing.rowVoice"), no, yes, yes, yes],
    [t("pricing.rowChannels"), t("pricing.valChE"), t("pricing.valChP"), t("pricing.valChB"), t("pricing.valChX")],
    [t("pricing.rowLanguages"), t("pricing.valLangE"), t("pricing.valLangP"), t("pricing.valLangB"), t("pricing.valLangX")],
    [t("pricing.rowCrm"), yes, yes, yes, yes],
    [t("pricing.rowWorkflows"), no, yes, yes, yes],
    [t("pricing.rowRag"), no, yes, yes, yes],
    [t("pricing.rowSeats"), t("pricing.valSeatsE"), t("pricing.valSeatsP"), t("pricing.valSeatsB"), t("pricing.valSeatsX")],
    [t("pricing.rowSupport"), t("pricing.valSupE"), t("pricing.valSupP"), t("pricing.valSupB"), t("pricing.valSupX")],
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

      {/* 8 — HINNOITTELU */}
      <section className="mkt-section" id="pricing" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("pricing.title")}</h2>
            <p className="mkt-section__sub">{t("pricing.subtitle")}</p>
          </Reveal>

          <Reveal className="mkt-pricing-wrap">
            <table className="mkt-pricing">
              <colgroup>
                <col />
                <col />
                <col className="is-popular" />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th />
                  <th>
                    <div className="mkt-plan__name">{t("pricing.planEssential")}</div>
                    <div className="mkt-plan__price">
                      {t("pricing.priceEssential")}
                      <span className="mkt-plan__per"> {t("pricing.perMonth")}</span>
                    </div>
                  </th>
                  <th className="is-popular">
                    <span className="mkt-pill-popular">{t("pricing.popular")}</span>
                    <div className="mkt-plan__name">{t("pricing.planProfessional")}</div>
                    <div className="mkt-plan__price">
                      {t("pricing.priceProfessional")}
                      <span className="mkt-plan__per"> {t("pricing.perMonth")}</span>
                    </div>
                  </th>
                  <th>
                    <div className="mkt-plan__name">{t("pricing.planBusiness")}</div>
                    <div className="mkt-plan__price">
                      {t("pricing.priceBusiness")}
                      <span className="mkt-plan__per"> {t("pricing.perMonth")}</span>
                    </div>
                  </th>
                  <th>
                    <div className="mkt-plan__name">{t("pricing.planEnterprise")}</div>
                    <div className="mkt-plan__price" style={{ fontSize: "1.15rem" }}>
                      {t("pricing.priceEnterprise")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, e, p, b, x]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{e}</td>
                    <td className="is-popular">{p}</td>
                    <td>{b}</td>
                    <td>{x}</td>
                  </tr>
                ))}
                <tr className="cta-row">
                  <td />
                  <td>
                    <Link href="/dashboard" className="mkt-btn mkt-btn--light mkt-btn--sm">
                      {t("pricing.cta")}
                    </Link>
                  </td>
                  <td className="is-popular">
                    <Link href="/dashboard" className="mkt-btn mkt-btn--primary mkt-btn--sm">
                      {t("pricing.cta")}
                    </Link>
                  </td>
                  <td>
                    <Link href="/dashboard" className="mkt-btn mkt-btn--light mkt-btn--sm">
                      {t("pricing.cta")}
                    </Link>
                  </td>
                  <td>
                    <a href="#contact" className="mkt-btn mkt-btn--light mkt-btn--sm">
                      {t("pricing.ctaEnterprise")}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* 9 — FOOTER */}
      <footer className="mkt-footer" id="contact">
        <div className="mkt-shell">
          <div className="mkt-footer__grid">
            <div>
              <div className="mkt-footer__brand">
                <span className="mkt-brand__dot" />
                Vahti&nbsp;AI
              </div>
              <p className="mkt-footer__tagline">{t("footer.tagline")}</p>
            </div>
            <div>
              <h4>{t("footer.colProduct")}</h4>
              <ul>
                <li>
                  <a href="#features">{t("footer.linkFeatures")}</a>
                </li>
                <li>
                  <a href="#pricing">{t("footer.linkPricing")}</a>
                </li>
                <li>
                  <Link href="/dashboard">{t("footer.linkDashboard")}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t("footer.colCompany")}</h4>
              <ul>
                <li>
                  <a href="#">{t("footer.linkAbout")}</a>
                </li>
                <li>
                  <a href="#contact">{t("footer.linkContact")}</a>
                </li>
                <li>
                  <a href="#">{t("footer.linkCareers")}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t("footer.colLegal")}</h4>
              <ul>
                <li>
                  <a href="#">{t("footer.linkPrivacy")}</a>
                </li>
                <li>
                  <a href="#">{t("footer.linkTerms")}</a>
                </li>
                <li>
                  <a href="#">{t("footer.linkGdpr")}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mkt-footer__bottom">
            <span>{t("footer.rights")}</span>
            <span>{t("footer.demoNote")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
