"use client";

import { useTranslations } from "next-intl";
import { useVoiceDemo, type VoiceLang } from "@/lib/useVoiceDemo";
import { IconMic } from "./icons";

const ERROR_KEY: Record<string, string> = {
  unsupported: "errUnsupported",
  "not-configured": "errNotConfigured",
  "permission-denied": "errPermissionDenied",
  empty: "errEmpty",
  "processing-error": "errProcessing",
};

/**
 * GÖREV — selaimen mikrofonilla käytettävä sesli demo. EI Twilioa: pelkkä
 * mikrofoni (MediaRecorder) → /api/voice-demo → Soniox STT/TTS + Claude.
 * Käytetään /demo-sivun "Puhu ääneen" -välilehdessä sekä etusivulla ja
 * /for-clinics:ssa omana osiona.
 */
export function VoiceDemo() {
  const t = useTranslations("Demo");
  const {
    supported,
    configured,
    status,
    level,
    turns,
    audioUrl,
    errorMessage,
    language,
    setLanguage,
    start,
    stop,
    dismissError,
    audioElRef,
  } = useVoiceDemo();

  const checking = configured === null;
  const recording = status === "recording";
  const processing = status === "processing";

  const bars = Array.from({ length: 5 }, (_, i) => {
    const h = recording ? 6 + level * (14 + i * 6) : 6;
    return h;
  });

  return (
    <div className="mkt-voicedemo">
      <div className="mkt-voicedemo__controls">
        <div className="mkt-voicedemo__langs" role="group" aria-label={t("languageLabel")}>
          {(["auto", "fi", "en"] as VoiceLang[]).map((l) => (
            <button
              key={l}
              type="button"
              className={`mkt-voicedemo__lang ${language === l ? "is-active" : ""}`}
              onClick={() => setLanguage(l)}
              disabled={recording || processing}
            >
              {l === "auto" ? t("languageAuto") : l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`mkt-voicedemo__mic ${recording ? "is-recording" : ""}`}
          onClick={recording ? stop : start}
          disabled={checking || processing || !supported}
          aria-pressed={recording}
        >
          <IconMic />
        </button>

        <div className="mkt-voicedemo__bars" aria-hidden>
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}px` }} />
          ))}
        </div>

        <p className="mkt-voicedemo__status">
          {!supported
            ? t("errUnsupported")
            : checking
              ? t("micChecking")
              : recording
                ? t("micListening")
                : processing
                  ? t("micProcessing")
                  : t("micIdleHint")}
        </p>
      </div>

      {status === "error" && errorMessage && (
        <div className="mkt-voicedemo__error">
          <span>{t(ERROR_KEY[errorMessage] ?? "errProcessing")}</span>
          <button type="button" onClick={dismissError}>
            {t("dismiss")}
          </button>
        </div>
      )}

      {turns.length > 0 && (
        <div className="mkt-voicedemo__log">
          {turns.map((m, i) => (
            <div key={i}>
              <div className="mkt-voicedemo__caption-label">
                {m.role === "user" ? t("youSaid") : t("aiReplied")}
              </div>
              <div className={`mkt-bubble mkt-bubble--${m.role === "user" ? "patient" : "ai"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {audioUrl && (
            <div className="mkt-voicedemo__replay">
              <audio ref={audioElRef} src={audioUrl} controls preload="none" />
            </div>
          )}
        </div>
      )}

      <p className="mkt-voicedemo__privacy">{t("privacyNote")}</p>
    </div>
  );
}
