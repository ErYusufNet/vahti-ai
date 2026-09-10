import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Luo tili · Vahti AI" };

export default async function SignupPage() {
  const t = await getTranslations("Auth");
  return (
    <div className="auth-card">
      <h1>{t("signupTitle")}</h1>
      <p className="auth-card__sub">{t("signupSub")}</p>
      <SignupForm />
      <p className="auth-card__alt">
        {t("haveAccount")} <Link href="/login">{t("toLogin")}</Link>
      </p>
    </div>
  );
}
