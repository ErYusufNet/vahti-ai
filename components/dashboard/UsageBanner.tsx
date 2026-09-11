import { getTranslations } from "next-intl/server";
import { getMonthlyUsage, isNearLimit } from "@/lib/usage";

/**
 * GÖREV C — koko dashboardin varoitusbanneri, kun ääni- tai WhatsApp-kiintiö
 * on saavuttanut 80 %. Ei näytetä ollenkaan, jos kumpikaan ei ole lähellä.
 */
export async function UsageBanner() {
  const usage = await getMonthlyUsage();
  if (!isNearLimit(usage, 80)) return null;

  const t = await getTranslations("Settings");
  const voiceNear = (usage.voicePct ?? 0) >= 80;
  const whatsappNear = (usage.whatsappPct ?? 0) >= 80;
  const what =
    voiceNear && whatsappNear
      ? t("usageWhatBoth")
      : voiceNear
        ? t("usageWhatVoice")
        : t("usageWhatWhatsapp");
  const pct = Math.max(usage.voicePct ?? 0, usage.whatsappPct ?? 0);

  return (
    <div className="usage-banner">{t("usageBanner", { pct, what })}</div>
  );
}
