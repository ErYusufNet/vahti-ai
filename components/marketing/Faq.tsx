"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** GÖREV B — akordiyon UKK. 6 kysymys/vastaus. */
export function Faq() {
  const t = useTranslations("ForClinics");
  const [open, setOpen] = useState<number | null>(0);

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`faq${n}Q` as "faq1Q"),
    a: t(`faq${n}A` as "faq1A"),
  }));

  return (
    <div className="mkt-faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`mkt-faq__item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="mkt-faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="mkt-faq__icon" aria-hidden>
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen && <div className="mkt-faq__a">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
