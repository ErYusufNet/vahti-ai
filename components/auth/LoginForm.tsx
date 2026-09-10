"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth-constants";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (!res || res.error) {
      setError(t("badCredentials"));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <label>
        {t("email")}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label>
        {t("password")}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      {error && <div className="auth-form__err">{error}</div>}
      <button className="auth-btn" disabled={busy}>
        {busy ? t("loading") : t("loginCta")}
      </button>
      <button
        type="button"
        className="auth-btn auth-btn--ghost"
        onClick={() => {
          setEmail(DEMO_EMAIL);
          setPassword(DEMO_PASSWORD);
        }}
      >
        {t("fillDemo")}
      </button>
    </form>
  );
}
