"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** Ennen/jälkeen-liukusäädin (mock — ei oikeaa AI-käsittelyä). */
export function BeforeAfter() {
  const t = useTranslations("Modules");
  const [pos, setPos] = useState(50);

  return (
    <div className="mkt-ba">
      <div className="mkt-ba__stage">
        <div className="mkt-ba__pane mkt-ba__pane--after">
          <Smile variant="after" />
          <span className="mkt-ba__tag mkt-ba__tag--after">{t("baAfter")}</span>
        </div>
        <div
          className="mkt-ba__pane mkt-ba__pane--before"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Smile variant="before" />
          <span className="mkt-ba__tag mkt-ba__tag--before">{t("baBefore")}</span>
        </div>
        <div className="mkt-ba__divider" style={{ left: `${pos}%` }}>
          <span className="mkt-ba__handle" aria-hidden>
            ⇆
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mkt-ba__range"
        aria-label={t("baSlider")}
      />
      <p className="mkt-ba__note">{t("baNote")}</p>
    </div>
  );
}

function Smile({ variant }: { variant: "before" | "after" }) {
  const after = variant === "after";
  const tooth = after ? "#ffffff" : "#e9e2c9";
  const gum = after ? "#f7c9cf" : "#e6b3ba";
  return (
    <svg viewBox="0 0 320 200" className="mkt-ba__svg" role="img" aria-label={variant}>
      <defs>
        <radialGradient id={`bg-${variant}`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor={after ? "#eaf6ff" : "#f1ede3"} />
          <stop offset="100%" stopColor={after ? "#cfe8fb" : "#ded7c6"} />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#bg-${variant})`} />
      {/* huulet */}
      <path d="M60 120 Q160 60 260 120 Q160 175 60 120 Z" fill={gum} />
      {/* hampaat */}
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={92 + i * 23}
            y={104}
            width={after ? 20 : 18}
            height={after ? 34 : 30 - (i % 2) * 4}
            rx={4}
            fill={tooth}
            stroke={after ? "#dbe9f3" : "#cfc7ad"}
          />
        ))}
        {!after && <rect x={92 + 3 * 23 - 4} y={104} width={6} height={26} fill={gum} />}
      </g>
      {after && (
        <g fill="#38bdf8">
          <path d="M250 46 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" />
          <circle cx="270" cy="70" r="3" />
        </g>
      )}
    </svg>
  );
}
