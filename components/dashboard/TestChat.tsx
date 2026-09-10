"use client";

import { useTranslations } from "next-intl";
import { useAgentChat } from "@/lib/useAgentChat";

/** Görev 2 + 7: agentin testinäyttö. Jakaa logiikan demon kanssa (useAgentChat). */
export function TestChat() {
  const t = useTranslations("AiAssistant");
  const { turns, input, setInput, busy, meta, send, logRef } = useAgentChat();

  return (
    <div>
      <div className="section-title">{t("testTitle")}</div>
      <p className="dash-page-sub" style={{ marginBottom: ".7rem" }}>
        {t("testSubtitle")}
      </p>

      <div
        className={`notice ${meta?.mode === "live" ? "notice--accent" : ""}`}
        style={{ marginBottom: ".6rem" }}
      >
        {meta?.mode === "live"
          ? `${t("modeLive")}${meta.model ? ` · ${meta.model}` : ""}`
          : t("modeMock")}
      </div>

      <div className="chat-box">
        <div className="chat-log" ref={logRef}>
          {turns.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              {t("chatPlaceholder")}
            </p>
          )}
          {turns.map((m, i) => (
            <div key={i} className={`msg msg--${m.role === "user" ? "potilas" : "tekoäly"}`}>
              <div className="msg__meta">
                {m.role === "user" ? t("you") : "Vahti AI"}
              </div>
              {m.content}
            </div>
          ))}
          {meta?.toolCalls?.length ? (
            <div className="notice" style={{ marginTop: ".4rem" }}>
              🔧 {t("toolCalled")}: {meta.toolCalls.map((c) => c.name).join(", ")}
            </div>
          ) : null}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("chatPlaceholder")}
            disabled={busy}
          />
          <button className="btn" onClick={send} disabled={busy}>
            {busy ? t("sending") : t("send")}
          </button>
        </div>
      </div>
    </div>
  );
}
