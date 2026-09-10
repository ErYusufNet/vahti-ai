"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

/** GÖREV E — yhteydenottolomake (mock: submit → console.log). */
export function ContactForm() {
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    console.log("[contact] viesti (demo):", form);
    setSent(true);
  }

  if (sent) return <div className="mkt-form__ok">{t("formSent")}</div>;

  return (
    <form onSubmit={submit} className="mkt-form">
      <label>
        {t("formName")}
        <input value={form.name} onChange={set("name")} required autoComplete="name" />
      </label>
      <label>
        {t("formEmail")}
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          required
          autoComplete="email"
        />
      </label>
      <label>
        {t("formMessage")}
        <textarea value={form.message} onChange={set("message")} rows={4} required />
      </label>
      <button className="mkt-btn mkt-btn--primary" type="submit">
        {t("formSubmit")}
      </button>
    </form>
  );
}
