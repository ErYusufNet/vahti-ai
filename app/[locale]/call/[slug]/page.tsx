import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CallWidget } from "@/components/widget/CallWidget";
import { getClinicBySlug } from "@/lib/callbacks";
import { integrationStatus } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);
  return { title: clinic ? `${clinic.ad} · Vahti AI` : "Vahti AI" };
}

/**
 * GÖREV B — /[locale]/call/[slug]
 * Jaettavan puhelulinkin kohde: sama widget koko sivun tilassa, avautuu heti.
 * Ei markkinointiheaderiä/footeria — keskittynyt kokemus.
 */
export default async function CallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);
  if (!clinic) notFound();

  const t = await getTranslations("Widget");

  return (
    <div className="cw-page">
      <div className="cw-page__brand">
        <span className="cw-page__dot" />
        Vahti&nbsp;AI
      </div>
      <div className="cw-page__body">
        <h1 className="cw-page__title">
          {t("fullHeading", { clinic: clinic.ad })}
        </h1>
        <CallWidget
          fullPage
          clinicName={clinic.ad}
          slug={slug}
          backupNumber={clinic.varayhteysNumero}
          twilioConfigured={integrationStatus().twilio}
        />
      </div>
    </div>
  );
}
