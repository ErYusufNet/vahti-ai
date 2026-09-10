import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/marketing/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  return { title: `${t("eyebrow")} · Vahti AI`, description: t("lead") };
}

/** GÖREV E — /[locale]/about */
export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <>
      <section className="mkt-hero mkt-hero--short">
        <div className="mkt-hero__grid" aria-hidden />
        <span className="mkt-orb mkt-orb--1" aria-hidden />
        <div className="mkt-shell mkt-hero__body mkt-hero__body--short">
          <span className="mkt-eyebrow" style={{ color: "var(--accent-2)" }}>
            {t("eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)" }}>{t("title")}</h1>
          <p className="mkt-hero__sub">{t("lead")}</p>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-shell mkt-shell--narrow">
          <Reveal as="div">
            <p className="mkt-prose">{t("body1")}</p>
            <p className="mkt-prose">{t("body2")}</p>
          </Reveal>
        </div>
      </section>

      <section className="mkt-section" style={{ background: "#eef2f7" }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("teamTitle")}</h2>
          </Reveal>
          <div className="mkt-cards mkt-cards--2" style={{ maxWidth: 640, margin: "0 auto" }}>
            {[1, 2].map((n) => (
              <Reveal key={n} delay={n * 80} className="mkt-card mkt-founder">
                <div className="mkt-founder__avatar" aria-hidden>
                  N
                </div>
                <h3>{t(`founder${n}Name` as "founder1Name")}</h3>
                <p>{t(`founder${n}Role` as "founder1Role")}</p>
              </Reveal>
            ))}
          </div>
          <p
            className="mkt-section__sub"
            style={{ textAlign: "center", marginTop: "1.4rem" }}
          >
            {t("founderNote")}
          </p>
        </div>
      </section>
    </>
  );
}
