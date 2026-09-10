import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/marketing/Reveal";
import { ContactForm } from "@/components/marketing/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return { title: `${t("title")} · Vahti AI`, description: t("subtitle") };
}

/** GÖREV E — /[locale]/contact */
export default async function ContactPage() {
  const t = await getTranslations("Contact");

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
          <p className="mkt-prose" style={{ marginBottom: "1.4rem" }}>
            {t("emailLabel")}:{" "}
            <a href={`mailto:${t("email")}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
              {t("email")}
            </a>
          </p>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
