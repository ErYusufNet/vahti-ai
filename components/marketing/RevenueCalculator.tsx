"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

/** Görev: interaktiivinen tulonmenetyslaskuri (React-tila, reaaliaikainen). */
export function RevenueCalculator() {
  const t = useTranslations("Landing.calc");
  const locale = useLocale();
  const [value, setValue] = useState(250); // käynnin keskiarvo €
  const [missed, setMissed] = useState(15); // menetettyä yhteydenottoa / vko
  const [conv, setConv] = useState(35); // muuntuma-%

  const { monthly, yearly } = useMemo(() => {
    const m = value * missed * 4.33 * (conv / 100);
    return { monthly: Math.round(m), yearly: Math.round(m * 12) };
  }, [value, missed, conv]);

  const eur = (n: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-FI" : "fi-FI", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="mkt-calc__panel">
      <div>
        <Field
          label={t("valueLabel")}
          min={80}
          max={2000}
          step={10}
          value={value}
          onChange={setValue}
          display={eur(value)}
        />
        <Field
          label={t("missedLabel")}
          min={1}
          max={80}
          step={1}
          value={missed}
          onChange={setMissed}
          display={String(missed)}
        />
        <Field
          label={t("conversionLabel")}
          min={5}
          max={90}
          step={1}
          value={conv}
          onChange={setConv}
          display={`${conv} %`}
        />
      </div>

      <div className="mkt-calc__result">
        <div className="mkt-calc__result-label">{t("resultLabel")}</div>
        <div className="mkt-calc__big">{eur(monthly)}</div>
        <div className="mkt-calc__result-label">{t("monthly")}</div>
        <div className="mkt-calc__yearly" style={{ marginTop: "0.7rem" }}>
          {eur(yearly)} {t("yearly")}
        </div>
        <p className="mkt-calc__note">{t("recovered")}</p>
      </div>

      <p className="mkt-calc__note" style={{ gridColumn: "1 / -1" }}>
        {t("note")}
      </p>
    </div>
  );
}

function Field({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  display: string;
}) {
  return (
    <div className="mkt-field">
      <label>{label}</label>
      <div className="mkt-field__row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="mkt-field__val">{display}</span>
      </div>
    </div>
  );
}
