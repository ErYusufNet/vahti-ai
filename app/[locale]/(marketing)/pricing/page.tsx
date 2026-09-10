import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { PlanCards } from "@/components/marketing/PlanCards";
import { PricingTable } from "@/components/marketing/PricingTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pricing");
  return { title: `${t("title")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV A — /[locale]/pricing */
export default async function PricingPage() {
  const t = await getTranslations("Pricing");

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

      <section className="mkt-section mkt-section--tight">
        <div className="mkt-shell">
          <Reveal>
            <PlanCards />
          </Reveal>
        </div>
      </section>

      <section className="mkt-section" style={{ background: "#eef2f7", paddingTop: 0 }}>
        <div className="mkt-shell">
          <Reveal className="mkt-section__head mkt-section__head--center">
            <h2>{t("comparisonTitle")}</h2>
          </Reveal>
          <Reveal>
            <PricingTable />
          </Reveal>

          <Reveal className="mkt-section__head--center" as="div">
            <p className="mkt-section__sub" style={{ marginTop: "1.6rem" }}>
              {t("faqTeaser")}{" "}
              <Link href="/for-clinics" style={{ color: "var(--accent)", fontWeight: 600 }}>
                {t("faqLink")}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
