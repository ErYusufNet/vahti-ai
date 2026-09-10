"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useAgentChat } from "@/lib/useAgentChat";

type State = "closed" | "connecting" | "chatting" | "fallback" | "sent";

type Props = {
  /** Koko sivun tila (/call/<slug>) — ei kelluvaa nappia, avautuu heti. */
  fullPage?: boolean;
  clinicName?: string;
  slug?: string;
  backupNumber?: string | null;
  twilioConfigured?: boolean;
};

/**
 * GÖREV A — selaimen sisäinen "soita tekoälylle" -widget.
 *
 * Oikeaa ääntä (WebRTC / Twilio) ei ole vielä — tämä on tekstipohjainen
 * "puhelusimulaatio": käyttöliittymä näyttää puhelulta, mutta käyttäjä
 * kirjoittaa. Oikea ääniputki kuuluu Görev 9:ään (lib/voice/*).
 * GÖREV D: näkyvä tekoäly-ilmoitus + "Pyydä ihmistä" -nappi koko ajan.
 */
export function CallWidget({
  fullPage = false,
  clinicName,
  slug,
  backupNumber = null,
  twilioConfigured = false,
}: Props) {
  const t = useTranslations("Widget");
  const pathname = usePathname();
  const [state, setState] = useState<State>(fullPage ? "connecting" : "closed");
  const [seconds, setSeconds] = useState(0);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const { turns, input, setInput, busy, send, logRef } = useAgentChat();

  // Kelluvaa nappia ei näytetä hallintapaneelissa/kirjautumisessa/call-sivulla.
  const hiddenPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/call");

  // "Yhdistäminen" → chatting
  useEffect(() => {
    if (state !== "connecting") return;
    const id = setTimeout(() => setState("chatting"), 1600);
    return () => clearTimeout(id);
  }, [state]);

  // Puhelun kesto
  useEffect(() => {
    if (state !== "chatting") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  if (!fullPage && hiddenPath) return null;

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

  function reset() {
    setState(fullPage ? "connecting" : "closed");
    setSeconds(0);
  }

  return (
    <div className={fullPage ? "cw cw--full" : "cw"}>
      {!fullPage && state === "closed" && (
        <button className="cw-fab" onClick={() => setState("connecting")}>
          <PhoneIcon />
          {t("fab")}
        </button>
      )}

      {(fullPage || state !== "closed") && state !== "closed" && (
        <div className={fullPage ? "cw-panel cw-panel--full" : "cw-panel"}>
          {/* Ylätunniste */}
          <div className="cw-head">
            <div className="cw-head__id">
              <span className={`cw-dot ${state === "chatting" ? "is-live" : ""}`} />
              <div>
                <strong>{clinicName ?? "Vahti AI"}</strong>
                <div className="cw-head__sub">
                  {state === "connecting"
                    ? t("connecting")
                    : state === "chatting"
                      ? `${t("aiReception")} · ${clock}`
                      : t("aiReception")}
                </div>
              </div>
            </div>
            {!fullPage && (
              <button className="cw-x" onClick={() => setState("closed")} aria-label="Sulje">
                ✕
              </button>
            )}
          </div>

          {/* Yhdistäminen */}
          {state === "connecting" && (
            <div className="cw-connecting">
              <div className="cw-pulse" />
              <p>{t("connectingBody")}</p>
            </div>
          )}

          {/* Chat ("puhelu") */}
          {state === "chatting" && (
            <>
              <div className="cw-disclosure">{t("aiDisclosure")}</div>
              <div className="cw-log" ref={logRef}>
                {turns.length === 0 && <p className="cw-hint">{t("chatHint")}</p>}
                {turns.map((m, i) => (
                  <div
                    key={i}
                    className={`cw-bubble cw-bubble--${m.role === "user" ? "me" : "ai"}`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
              <div className="cw-input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("inputPlaceholder")}
                  disabled={busy}
                />
                <button className="cw-send" onClick={send} disabled={busy}>
                  {busy ? "…" : t("send")}
                </button>
              </div>
              <div className="cw-actions">
                <button className="cw-human" onClick={() => setState("fallback")}>
                  {t("askHuman")}
                </button>
                <button className="cw-end" onClick={reset}>
                  {t("endCall")}
                </button>
              </div>
            </>
          )}

          {/* Fallback: jätä viesti */}
          {state === "fallback" && (
            <FallbackForm
              slug={slug}
              backupNumber={backupNumber}
              twilioConfigured={twilioConfigured}
              onSent={(who) => {
                setAssignedTo(who);
                setState("sent");
              }}
            />
          )}

          {/* Kiitos */}
          {state === "sent" && (
            <div className="cw-sent">
              <div className="cw-check">✓</div>
              <p>{t("sentBody")}</p>
              {assignedTo && (
                <p className="cw-sent__who">
                  {t("assignedTo")}: <strong>{assignedTo}</strong>
                </p>
              )}
              <button className="cw-human" onClick={reset}>
                {t("close")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FallbackForm({
  slug,
  backupNumber: backupProp,
  twilioConfigured: twilioProp,
  onSent,
}: {
  slug?: string;
  backupNumber: string | null;
  twilioConfigured: boolean;
  onSent: (assignedTo: string | null) => void;
}) {
  const t = useTranslations("Widget");
  const [form, setForm] = useState({
    nimi: "",
    email: "",
    puhelin: "",
    aihe: "",
    viesti: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [backupNumber, setBackupNumber] = useState<string | null>(backupProp);
  const [twilioConfigured, setTwilioConfigured] = useState(twilioProp);

  useEffect(() => {
    if (backupProp) return;
    fetch(`/api/callback${slug ? `?slug=${encodeURIComponent(slug)}` : ""}`)
      .then((r) => r.json())
      .then((d: { backupNumber: string | null; twilioConfigured: boolean }) => {
        setBackupNumber(d.backupNumber);
        setTwilioConfigured(d.twilioConfigured);
      })
      .catch(() => {});
  }, [backupProp, slug]);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, tapa: "aani", lahde: slug ? "call-link" : "widget", slug }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErr(data.error ?? "Virhe");
        return;
      }
      onSent(data.assignedTo ?? null);
    } catch {
      setErr("Verkkovirhe");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cw-fallback">
      <p className="cw-fallback__lead">{t("fallbackLead")}</p>

      {backupNumber && (
        <div className="cw-backup">
          {t("backupCall")} <a href={`tel:${backupNumber.replace(/\s/g, "")}`}>{backupNumber}</a>
          <div className="cw-backup__todo">
            {twilioConfigured ? t("backupForwardOn") : t("backupForwardTodo")}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="cw-form">
        <input placeholder={t("fName")} value={form.nimi} onChange={set("nimi")} required />
        <input placeholder={t("fEmail")} type="email" value={form.email} onChange={set("email")} />
        <input placeholder={t("fPhone")} value={form.puhelin} onChange={set("puhelin")} />
        <input placeholder={t("fSubject")} value={form.aihe} onChange={set("aihe")} />
        <textarea placeholder={t("fNote")} rows={3} value={form.viesti} onChange={set("viesti")} required />
        {err && <div className="cw-err">{err}</div>}
        <button className="cw-send" type="submit" disabled={busy}>
          {busy ? "…" : t("leaveMessage")}
        </button>
      </form>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
