"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

/** Tumman heron päällä läpinäkyvä header, joka muuttuu kiinteäksi vieritettäessä. */
export function MarketingHeader() {
  const t = useTranslations("Landing.nav");
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`mkt-header ${solid ? "mkt-header--solid" : ""}`}>
      <div className="mkt-shell mkt-header__inner">
        <Link href="/" className="mkt-brand">
          <span className="mkt-brand__dot" />
          Vahti&nbsp;AI
        </Link>

        <nav className="mkt-header__nav">
          <Link href="/for-clinics">{t("forClinics")}</Link>
          <Link href="/pricing">{t("pricing")}</Link>
          <Link href="/login">{t("login")}</Link>
        </nav>

        <div className="mkt-header__right">
          <LocaleSwitcher />
          <Link href="/signup" className="mkt-btn mkt-btn--primary mkt-btn--sm">
            {t("signup")}
          </Link>
        </div>
      </div>
    </header>
  );
}
