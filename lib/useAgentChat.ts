"use client";

import { useCallback, useRef, useState } from "react";

export type Turn = { role: "user" | "assistant"; content: string };

export type AgentMeta = {
  reply: string;
  language: string;
  mode: "live" | "mock";
  model: string | null;
  note?: string;
  toolCalls: { name: string }[];
};

/**
 * Jaettu agentin chat-logiikka (POST /api/chat). Käytetään sekä
 * hallintapaneelin testinäytössä (TestChat) että julkisessa demossa (DemoChat).
 */
export function useAgentChat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState<AgentMeta | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
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
      const data: AgentMeta = await res.json();
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
  }, [input, busy, turns]);

  return { turns, input, setInput, busy, meta, send, logRef };
}
