import { defineRouting } from "next-intl/routing";

/**
 * Tuetut kielet. Suomi (fi) on oletus, englanti (en) toissijainen.
 * URL-rakenne: "/" → fi, "/en/..." → en (oletuskielen etuliite piilotettu).
 */
export const routing = defineRouting({
  locales: ["fi", "en"],
  defaultLocale: "fi",
});

export type Locale = (typeof routing.locales)[number];
