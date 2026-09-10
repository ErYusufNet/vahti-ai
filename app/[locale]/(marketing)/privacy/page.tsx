import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/marketing/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  return { title: `${t("title")} · Vahti AI` };
}

export default function Privacy() {
  return <LegalPage ns="Privacy" />;
}
