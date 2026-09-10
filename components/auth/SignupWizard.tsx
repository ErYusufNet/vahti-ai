"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import { PLAN_ORDER, PLAN_PRICE_EUR, POPULAR_PLAN, type PlanId } from "@/lib/pricing";

const SECTORS = ["dental", "aesthetic", "hair", "physio", "other"] as const;

export function SignupWizard() {
  const t = useTranslations("Auth");
  const tp = useTranslations("Pricing");
  const params = useSearchParams();
  const router = useRouter();

  const initialPlan = (params.get("plan") ?? "") as PlanId;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    clinicName: "",
    city: "",
    sector: "dental" as (typeof SECTORS)[number],
    plan: PLAN_ORDER.includes(initialPlan) ? initialPlan : POPULAR_PLAN,
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function next() {
    setError(null);
    if (step === 1 && !form.clinicName.trim()) {
      setError(t("clinicNameRequired"));
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

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
      <ol className="auth-steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className={n === step ? "is-active" : n < step ? "is-done" : ""}>
            <span>{n}</span>
            {t(`step${n}` as "step1")}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <>
          <label>
            {t("clinicName")}
            <input
              value={form.clinicName}
              onChange={(e) => upd("clinicName", e.target.value)}
              autoFocus
              autoComplete="organization"
            />
          </label>
          <label>
            {t("city")}
            <input
              value={form.city}
              onChange={(e) => upd("city", e.target.value)}
              autoComplete="address-level2"
            />
          </label>
          <label>
            {t("sector")}
            <select
              value={form.sector}
              onChange={(e) => upd("sector", e.target.value as (typeof SECTORS)[number])}
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {t(`sector_${s}` as "sector_dental")}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {step === 2 && (
        <div className="auth-plans">
          {PLAN_ORDER.map((p) => (
            <label
              key={p}
              className={`auth-plan ${form.plan === p ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="plan"
                value={p}
                checked={form.plan === p}
                onChange={() => upd("plan", p)}
              />
              <span className="auth-plan__name">
                {tp(`plan${p[0].toUpperCase()}${p.slice(1)}` as "planEssential")}
                {p === POPULAR_PLAN && <em> · {tp("popular")}</em>}
              </span>
              <span className="auth-plan__price">
                {PLAN_PRICE_EUR[p] ? `${PLAN_PRICE_EUR[p]} € ${tp("perMonth")}` : tp("priceEnterprise")}
              </span>
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <>
          <label>
            {t("name")}
            <input
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              required
              autoFocus
              autoComplete="name"
            />
          </label>
          <label>
            {t("email")}
            <input
              type="email"
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            {t("password")}
            <input
              type="password"
              value={form.password}
              onChange={(e) => upd("password", e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
        </>
      )}

      {error && <div className="auth-form__err">{error}</div>}
      {demo && (
        <div className="auth-form__ok">
          {demo} <Link href="/login">{t("toLogin")}</Link>
        </div>
      )}

      <div className="auth-wizard-nav">
        {step > 1 && (
          <button
            type="button"
            className="auth-btn auth-btn--ghost"
            onClick={() => setStep((s) => s - 1)}
          >
            {t("back")}
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="auth-btn" onClick={next}>
            {t("next")}
          </button>
        ) : (
          <button className="auth-btn" disabled={busy}>
            {busy ? t("loading") : t("signupCta")}
          </button>
        )}
      </div>
    </form>
  );
}
