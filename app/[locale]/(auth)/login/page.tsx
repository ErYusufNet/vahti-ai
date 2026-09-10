import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth-constants";

export const metadata: Metadata = { title: "Kirjaudu · Vahti AI" };

export default async function LoginPage() {
  const t = await getTranslations("Auth");
  return (
    <div className="auth-card">
      <h1>{t("loginTitle")}</h1>
      <p className="auth-card__sub">{t("loginSub")}</p>
      <LoginForm />
      <p className="auth-card__alt">
        {t("noAccount")} <Link href="/signup">{t("toSignup")}</Link>
      </p>
      <div className="auth-demo">
        {t("demoHint")} <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
      </div>
    </div>
  );
}
