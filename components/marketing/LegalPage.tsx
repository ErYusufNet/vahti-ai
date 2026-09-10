import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/marketing/Reveal";

/** GÖREV E — jaettu pohja lakisivuille (Privacy / Terms). */
export async function LegalPage({ ns }: { ns: "Privacy" | "Terms" }) {
  const t = await getTranslations(ns);
  const sections = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`s${n}Title` as "s1Title"),
    body: t(`s${n}Body` as "s1Body"),
  }));

  return (
    <>
      <section className="mkt-hero mkt-hero--short">
        <div className="mkt-hero__grid" aria-hidden />
        <div className="mkt-shell mkt-hero__body mkt-hero__body--short">
          <span className="mkt-eyebrow" style={{ color: "var(--accent-2)" }}>
            {t("eyebrow")}
          </span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>{t("title")}</h1>
        </div>
      </section>

      <section className="mkt-section mkt-section--tight">
        <div className="mkt-shell mkt-shell--narrow">
          <div className="mkt-legal-disclaimer">⚠ {t("disclaimer")}</div>
          <Reveal as="div">
            {sections.map((s) => (
              <div key={s.title} className="mkt-legal-section">
                <h2>{s.title}</h2>
                <p className="mkt-prose">{s.body}</p>
              </div>
            ))}
            <p className="mkt-legal-updated">{t("updated")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
