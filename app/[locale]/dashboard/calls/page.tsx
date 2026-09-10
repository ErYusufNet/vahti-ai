import { getTranslations } from "next-intl/server";
import { CallsView } from "@/components/dashboard/CallsView";
import { calls } from "@/lib/mock/data";

/**
 * Puhelut-näkymä. UI on valmis mock-datalla; oikea puhelu-/litterointiputki
 * (Twilio + Deepgram) on Görev 9 ja se on vain hahmoteltu (ks. lib/voice/).
 */
export default async function CallsPage() {
  const t = await getTranslations("Calls");
  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>
      <CallsView calls={calls} />
    </div>
  );
}
