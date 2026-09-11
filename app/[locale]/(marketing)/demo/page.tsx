import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DemoWidget } from "@/components/marketing/DemoWidget";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Demo");
  return { title: `${t("title")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV C — /[locale]/demo : julkinen interaktiivinen demo (ei kirjautumista). */
export default async function DemoPage() {
  const t = await getTranslations("Demo");

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
          <p className="mkt-hero__sub">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mkt-section mkt-section--tight">
        <div className="mkt-shell mkt-shell--narrow">
          <DemoWidget />
          <p className="mkt-section__sub" style={{ textAlign: "center", marginTop: "1.4rem" }}>
            {t("footnote")}{" "}
            <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>
              {t("footnoteCta")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
