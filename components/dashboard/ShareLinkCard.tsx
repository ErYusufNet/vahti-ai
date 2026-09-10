"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";

/** GÖREV B — jaettava puhelulinkki + QR-koodi (ladattava PNG). */
export function ShareLinkCard({
  slug,
  baseUrl,
}: {
  slug: string;
  baseUrl: string;
}) {
  const t = useTranslations("Settings");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const url = `${baseUrl}/fi/call/${slug}`;

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function download() {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `vahti-call-${slug}.png`;
    a.click();
  }

  return (
    <div className="share-card">
      <div className="share-card__left">
        <code className="share-card__url">{url}</code>
        <div className="share-card__actions">
          <button className="btn btn--ghost" onClick={copy}>
            {copied ? t("shareCopied") : t("shareCopy")}
          </button>
          <button className="btn btn--ghost" onClick={download}>
            {t("shareDownload")}
          </button>
        </div>
      </div>
      <div className="share-card__qr" ref={wrapRef}>
        <QRCodeCanvas value={url} size={132} level="M" marginSize={2} />
      </div>
    </div>
  );
}
