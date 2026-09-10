import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CallWidget } from "@/components/widget/CallWidget";
import "../globals.css";
import "./call-widget.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/** Esirenderöi molemmat kielet staattisesti. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Ottaa staattisen renderöinnin käyttöön tälle kielelle.
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
          {/* GÖREV A — kelluva puhelu-widget (piilotettu dashboardissa/call-sivulla) */}
          <CallWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
