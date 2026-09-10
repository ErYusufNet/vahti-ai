"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Yksinkertainen fi|en-kielivalitsin headeriin. */
export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="locale-switcher" role="group" aria-label="Language">
      {routing.locales.map((locale, index) => (
        <span key={locale}>
          {index > 0 && <span className="locale-switcher__sep">|</span>}
          <button
            type="button"
            className="locale-switcher__btn"
            aria-current={locale === activeLocale ? "true" : undefined}
            disabled={locale === activeLocale}
            onClick={() => router.replace(pathname, { locale })}
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
