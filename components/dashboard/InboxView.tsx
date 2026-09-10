"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Channel, Conversation } from "@/lib/mock/data";
import { clock } from "@/lib/format";

const CHANNEL_KEYS: Channel[] = ["whatsapp", "voice", "webchat", "instagram"];

export function InboxView({ conversations }: { conversations: Conversation[] }) {
  const t = useTranslations("Inbox");
  const tc = useTranslations("Channels");
  const [filter, setFilter] = useState<Channel | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id ?? "");

  const list = useMemo(
    () =>
      filter === "all"
        ? conversations
        : conversations.filter((c) => c.kanava === filter),
    [conversations, filter],
  );

  const selected = conversations.find((c) => c.id === selectedId) ?? list[0];

  const roleLabel = (r: string) =>
    r === "potilas"
      ? t("rolePotilas")
      : r === "tekoäly"
        ? t("roleTekoaly")
        : t("roleHoitaja");

  return (
    <div className="inbox-layout">
      <div className="conv-list">
        <div className="conv-filters">
          <button
            className="conv-filter"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            {t("filterAll")}
          </button>
          {CHANNEL_KEYS.map((c) => (
            <button
              key={c}
              className="conv-filter"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {tc(c)}
            </button>
          ))}
        </div>

        {list.length === 0 && (
          <p style={{ padding: "1rem", color: "var(--muted)", fontSize: ".85rem" }}>
            {t("empty")}
          </p>
        )}

        {list.map((c) => (
          <button
            key={c.id}
            className="conv-row"
            aria-current={selected?.id === c.id}
            onClick={() => setSelectedId(c.id)}
          >
            <div className="conv-row__top">
              <span className="conv-row__name">
                {c.lukematon && <span className="unread-dot" />} {c.isim}
              </span>
              <span className="conv-row__time">{clock(c.aikaleima)}</span>
            </div>
            <div className="conv-row__preview">{c.esikatselu}</div>
            <div className="conv-row__tags">
              <span className="pill pill--accent">{tc(c.kanava)}</span>
              <span className="pill">{c.dil.toUpperCase()}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="conv-detail">
        {!selected ? (
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
            {t("selectHint")}
          </p>
        ) : (
          <>
            <div style={{ marginBottom: "0.9rem" }}>
              <strong>{selected.isim}</strong>{" "}
              <span className="pill pill--accent">{tc(selected.kanava)}</span>{" "}
              <span className="pill">
                {t("langLabel")}: {selected.dil.toUpperCase()}
              </span>
            </div>
            {selected.viestit.map((m, i) => (
              <div key={i} className={`msg msg--${m.rooli}`}>
                <div className="msg__meta">
                  {roleLabel(m.rooli)} · {m.aika}
                  {m.rooli === "tekoäly" && ` · ${t("aiHighlight")}`}
                </div>
                {m.teksti}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
