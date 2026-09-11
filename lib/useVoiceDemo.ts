"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceTurn = { role: "user" | "assistant"; content: string };
export type VoiceLang = "auto" | "fi" | "en";
export type VoiceStatus = "idle" | "recording" | "processing" | "error";

const MAX_RECORD_MS = 20_000; // sama raja kuin Twilio-puhelun <Record maxLength>

/**
 * Selaimen mikrofonilla käytettävä sesli demo -logiikka:
 *   mikrofoni → MediaRecorder → POST /api/voice-demo → Soniox STT → Claude
 *   → Soniox TTS → <audio> toistoon.
 *
 * KVKK/GDPR: äänidata elää vain tämän hookin muistissa (chunksRef) siihen
 * asti, että se on lähetetty backendille — sen jälkeen viittaus vapautetaan
 * eikä sitä koskaan kirjoiteta localStorageen/IndexedDB:hen tai levylle.
 */
export function useVoiceDemo() {
  const [supported, setSupported] = useState(true);
  const [configured, setConfigured] = useState<boolean | null>(null); // null = ei vielä tarkistettu
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [level, setLevel] = useState(0); // 0..1 mikrofonin äänenvoimakkuus (ääniaalto-indikaattori)
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<VoiceLang>("auto");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  // stopRef pitää aina tuoreimman stop()-sulkeuman — vältetään vanhentunut
  // sulkeuma, kun start()in sisäinen setTimeout kutsuu sitä myöhemmin.
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Selaintuen tarkistus siirretty samaan then()-ketjuun kuin /api/voice-demo:n
    // kysely, jotta molemmat päivittyvät yhdellä renderöinnillä mountin jälkeen.
    const browserOk =
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof window.MediaRecorder !== "undefined";

    fetch("/api/voice-demo")
      .then((r) => r.json())
      .then((d: { configured: boolean }) => {
        setSupported(browserOk);
        setConfigured(!!d.configured);
      })
      .catch(() => {
        setSupported(browserOk);
        setConfigured(false);
      });
  }, []);

  const cleanupAudioGraph = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevel(0);
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const pickMimeType = () => {
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
    return candidates.find((c) => window.MediaRecorder.isTypeSupported?.(c)) ?? "";
  };

  const send = useCallback(
    async (blob: Blob, durationMs: number) => {
      setStatus("processing");
      try {
        const form = new FormData();
        form.append("audio", blob, "kysymys.webm");
        form.append("durationMs", String(durationMs));
        if (language !== "auto") form.append("language", language);

        const res = await fetch("/api/voice-demo", { method: "POST", body: form });
        const data = await res.json();

        if (!data.ok) {
          setErrorMessage(data.configured === false ? "not-configured" : (data.error ?? "processing-error"));
          setStatus("error");
          return;
        }
        if (!data.transcript) {
          setErrorMessage("empty");
          setStatus("error");
          return;
        }

        setTurns((cur) => [
          ...cur,
          { role: "user", content: data.transcript },
          { role: "assistant", content: data.reply ?? "—" },
        ]);

        if (data.audioUrl) {
          setAudioUrl(data.audioUrl);
          requestAnimationFrame(() => {
            audioElRef.current?.play().catch(() => {
              /* autoplay estetty — käyttäjä voi toistaa manuaalisesti */
            });
          });
        }
        setStatus("idle");
      } catch {
        setErrorMessage("processing-error");
        setStatus("error");
      }
    },
    [language],
  );

  const stop = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    const durationMs = Date.now() - startedAtRef.current;
    recorder.addEventListener(
      "stop",
      () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        chunksRef.current = []; // vapauta viittaus heti — ei säilytystä
        void send(blob, durationMs);
      },
      { once: true },
    );
    recorder.stop();
  }, [send]);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const start = useCallback(async () => {
    setErrorMessage(null);
    setAudioUrl(null);
    setTurns([]);
    if (!supported) {
      setStatus("error");
      setErrorMessage("unsupported");
      return;
    }
    if (configured === false) {
      setStatus("error");
      setErrorMessage("not-configured");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Ääniaalto-indikaattori (AnalyserNode) — vain visuaalinen palaute, ei tallenneta.
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopTracks();
        cleanupAudioGraph();
      };

      recorder.start();
      startedAtRef.current = Date.now();
      setStatus("recording");

      stopTimerRef.current = setTimeout(() => stopRef.current(), MAX_RECORD_MS);
    } catch {
      stopTracks();
      cleanupAudioGraph();
      setStatus("error");
      setErrorMessage("permission-denied");
    }
  }, [supported, configured, stopTracks, cleanupAudioGraph]);

  // Puhdistus, jos komponentti puretaan kesken nauhoituksen.
  useEffect(() => {
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      stopTracks();
      cleanupAudioGraph();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissError = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
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
  };
}
