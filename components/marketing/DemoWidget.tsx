"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DemoChat } from "./DemoChat";
import { VoiceDemo } from "./VoiceDemo";

/** /demo-sivun välilehdet: kirjoitettu chat ja selaimen mikrofonilla käytettävä sesli demo. */
export function DemoWidget() {
  const t = useTranslations("Demo");
  const [tab, setTab] = useState<"text" | "voice">("text");

  return (
    <div>
      <div className="mkt-demo-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "text"}
          className={`mkt-demo-tab ${tab === "text" ? "is-active" : ""}`}
          onClick={() => setTab("text")}
        >
          {t("tabText")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "voice"}
          className={`mkt-demo-tab ${tab === "voice" ? "is-active" : ""}`}
          onClick={() => setTab("voice")}
        >
          {t("tabVoice")}
        </button>
      </div>
      {tab === "text" ? <DemoChat /> : <VoiceDemo />}
    </div>
  );
}
