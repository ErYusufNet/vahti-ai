"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Turn = { role: "user" | "assistant"; content: string };
type ApiResult = {
  reply: string;
  language: string;
  mode: "live" | "mock";
  model: string | null;
  note?: string;
  toolCalls: { name: string }[];
};

/** Görev 2 + 7: agentin testinäyttö. Kutsuu POST /api/chat. */
export function TestChat() {
  const t = useTranslations("AiAssistant");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState<ApiResult | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Turn[] = [...turns, { role: "user", content: text }];
    setTurns(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data: ApiResult = await res.json();
      setMeta(data);
      setTurns((cur) => [...cur, { role: "assistant", content: data.reply ?? "—" }]);
    } catch {
      setTurns((cur) => [
        ...cur,
        { role: "assistant", content: "Virhe: agenttiin ei saatu yhteyttä." },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        logRef.current?.scrollTo(0, logRef.current.scrollHeight);
      });
    }
  }

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
