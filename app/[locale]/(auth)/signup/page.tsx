import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignupWizard } from "@/components/auth/SignupWizard";

export const metadata: Metadata = { title: "Luo tili · Vahti AI" };

export default async function SignupPage() {
  const t = await getTranslations("Auth");
  return (
    <div className="auth-card auth-card--wide">
      <h1>{t("signupTitle")}</h1>
      <p className="auth-card__sub">{t("signupSub")}</p>
      <Suspense fallback={null}>
        <SignupWizard />
      </Suspense>
      <p className="auth-card__alt">
        {t("haveAccount")} <Link href="/login">{t("toLogin")}</Link>
      </p>
    </div>
  );
}
