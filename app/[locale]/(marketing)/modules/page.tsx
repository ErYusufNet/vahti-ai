import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { IconSpark2, IconMegaphone, IconLayers } from "@/components/marketing/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Modules");
  return { title: `${t("eyebrow")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV A — /[locale]/modules : lisämoduulien mağazası */
export default async function ModulesPage() {
  const t = await getTranslations("Modules");

  const modules = [
    {
      id: "hymysuunnittelu",
      Icon: IconSpark2,
      name: t("modSmileName"),
      tagline: t("modSmileTagline"),
      desc: t("modSmileDesc"),
      price: t("modSmilePrice"),
      features: [t("modSmileF1"), t("modSmileF2"), t("modSmileF3")],
    },
    {
      id: "someavustaja",
      Icon: IconMegaphone,
      name: t("modSocialName"),
      tagline: t("modSocialTagline"),
      desc: t("modSocialDesc"),
      price: t("modSocialPrice"),
      features: [t("modSocialF1"), t("modSocialF2"), t("modSocialF3")],
    },
    {
      id: "paketti",
      Icon: IconLayers,
      name: t("modBundleName"),
      tagline: t("modBundleTagline"),
      desc: t("modBundleDesc"),
      price: t("modBundlePrice"),
      features: [t("modSmileF1"), t("modSocialF1"), t("bundleSave")],
      popular: true,
    },
  ];

  const yes = <span className="yes">{t("yes")}</span>;
  const no = <span>{t("no")}</span>;
  const rows: [string, React.ReactNode, React.ReactNode, React.ReactNode][] = [
    [t("rowSim"), yes, no, no],
    [t("rowGallery"), yes, no, no],
    [t("rowWa"), yes, no, no],
    [t("rowContent"), no, yes, no],
    [t("rowSchedule"), no, yes, no],
    [t("rowBrand"), no, yes, no],
    [t("rowReception"), no, no, yes],
    [t("rowCrm"), no, no, yes],
  ];

  return (
    <>
      <section className="mkt-hero mkt-hero--short">
        <div className="mkt-hero__grid" aria-hidden />
        <span className="mkt-orb mkt-orb--1" aria-hidden />
        <div className="mkt-shell mkt-hero__body mkt-hero__body--short">
          <span className="mkt-eyebrow" style={{ color: "var(--accent-2)" }}>
            {t("eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>{t("title")}</h1>
          <p className="mkt-hero__sub">{t("subtitle")}</p>
        </div>
      </section>

      {/* Ennen/jälkeen-esikatselu */}
      <section className="mkt-section mkt-section--tight">
        <div className="mkt-shell mkt-shell--narrow">
          <Reveal>
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* Moduulikortit */}
      <section className="mkt-section" style={{ paddingTop: 0 }}>
        <div className="mkt-shell">
          <div className="mkt-cards mkt-cards--3">
            {modules.map(({ id, Icon, name, tagline, desc, price, features, popular }, i) => (
              <Reveal
                key={id}
                delay={i * 80}
                className={`mkt-card mkt-mod ${popular ? "mkt-mod--popular" : ""}`}
              >
                {popular && <span className="mkt-pill-popular">{t("bundleSave")}</span>}
                <div className="mkt-card__icon">
                  <Icon />
                </div>
                <h3>{name}</h3>
                <p className="mkt-mod__tagline">{tagline}</p>
                <div className="mkt-mod__price">
                  {price}
                  <span className="mkt-plan__per"> {t("perMonth")}</span>
                </div>
                <p>{desc}</p>
                <ul className="mkt-mod__list">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="mkt-mod__actions">
                  <Link href="/signup" className="mkt-btn mkt-btn--primary mkt-btn--sm">
                    {t("cta")}
                  </Link>
                  <a href={`#${id}-detay`} className="mkt-mod__how">
                    {t("howItWorks")} →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vertailutaulukko */}
      <section className="mkt-section" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("compareTitle")}</h2>
          </Reveal>
          <Reveal className="mkt-pricing-wrap">
            <table className="mkt-pricing">
              <thead>
                <tr>
                  <th>{t("compareCol1")}</th>
                  <th>{t("compareSmile")}</th>
                  <th>{t("compareSocial")}</th>
                  <th>{t("comparePlatform")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, a, b, c]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{a}</td>
                    <td>{b}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mkt-pricing__vat">{t("platformNote")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
