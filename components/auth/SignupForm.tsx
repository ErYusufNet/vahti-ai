"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";

export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [form, setForm] = useState({ name: "", clinicName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setDemo(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.demo) {
      setBusy(false);
      setDemo(data.message ?? t("demoSignup"));
      return;
    }
    if (!data.ok) {
      setBusy(false);
      setError(data.error ?? t("signupFailed"));
      return;
    }

    // Rekisteröinti onnistui → kirjaudu suoraan sisään
    const login = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setBusy(false);
    if (login && !login.error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/login");
    }
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <label>
        {t("name")}
        <input value={form.name} onChange={set("name")} required autoComplete="name" />
      </label>
      <label>
        {t("clinicName")}
        <input value={form.clinicName} onChange={set("clinicName")} autoComplete="organization" />
      </label>
      <label>
        {t("email")}
        <input type="email" value={form.email} onChange={set("email")} required autoComplete="email" />
      </label>
      <label>
        {t("password")}
        <input
          type="password"
          value={form.password}
          onChange={set("password")}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {error && <div className="auth-form__err">{error}</div>}
      {demo && (
        <div className="auth-form__ok">
          {demo} <Link href="/login">{t("toLogin")}</Link>
        </div>
      )}
      <button className="auth-btn" disabled={busy}>
        {busy ? t("loading") : t("signupCta")}
      </button>
    </form>
  );
}
