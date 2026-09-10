import { getTranslations } from "next-intl/server";
import { CallsView } from "@/components/dashboard/CallsView";
import { calls } from "@/lib/mock/data";
import { integrationStatus } from "@/lib/env";

/**
 * Puhelut-näkymä. UI on valmis mock-datalla; oikea puhelu-/litterointiputki
 * (Twilio + Deepgram) on Görev 9 ja se on vain hahmoteltu (ks. lib/voice/).
 */
export default async function CallsPage() {
  const t = await getTranslations("Calls");
  const s = integrationStatus();
  const voiceLive = s.twilio && s.anthropic;

  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>

      <div className={`notice ${voiceLive ? "notice--accent" : ""}`} style={{ marginBottom: "1rem" }}>
        {t("voiceStatus", {
          twilio: s.twilio ? "✓" : "✗",
          deepgram: s.deepgram ? "✓ Deepgram" : "Twilio STT",
          tts: s.elevenlabs ? "✓ ElevenLabs" : "Twilio Say",
        })}
      </div>

      <CallsView calls={calls} />
    </div>
  );
}
