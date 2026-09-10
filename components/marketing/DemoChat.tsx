"use client";

import { useTranslations } from "next-intl";
import { useAgentChat } from "@/lib/useAgentChat";

/** GÖREV C — julkinen demo-chat. Sama /api/chat-logiikka kuin testinäytössä. */
export function DemoChat() {
  const t = useTranslations("Demo");
  const { turns, input, setInput, busy, meta, send, logRef } = useAgentChat();

  const suggestions = [t("s1"), t("s2"), t("s3")];

  return (
    <div className="mkt-demochat">
      <div
        className={`mkt-demochat__status ${meta?.mode === "live" ? "is-live" : ""}`}
      >
        {meta?.mode === "live"
          ? `${t("modeLive")}${meta.model ? ` · ${meta.model}` : ""}`
          : t("modeMock")}
      </div>

      <div className="mkt-demochat__log" ref={logRef}>
        {turns.length === 0 ? (
          <div className="mkt-demochat__empty">
            <p>{t("placeholder")}</p>
            <div className="mkt-demochat__chips">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="mkt-demochat__chip"
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          turns.map((m, i) => (
            <div
              key={i}
              className={`mkt-bubble mkt-bubble--${m.role === "user" ? "patient" : "ai"}`}
            >
              {m.content}
            </div>
          ))
        )}
        {busy && <div className="mkt-demochat__typing">{t("typing")}</div>}
        {meta?.toolCalls?.length ? (
          <div className="mkt-demochat__tool">
            🔧 {t("toolCalled")}: {meta.toolCalls.map((c) => c.name).join(", ")}
          </div>
        ) : null}
      </div>

      <div className="mkt-demochat__input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("inputPlaceholder")}
          disabled={busy}
        />
        <button className="mkt-btn mkt-btn--primary" onClick={send} disabled={busy}>
          {busy ? t("sending") : t("send")}
        </button>
      </div>
    </div>
  );
}
