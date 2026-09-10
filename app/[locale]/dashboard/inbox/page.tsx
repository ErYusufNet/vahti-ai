import { getTranslations } from "next-intl/server";
import { InboxView } from "@/components/dashboard/InboxView";
import { conversations } from "@/lib/mock/data";

/** Görev 4 — /dashboard/inbox: kanavapohjainen keskustelulista + detaljipaneeli. */
export default async function InboxPage() {
  const t = await getTranslations("Inbox");
  return (
    <div>
      <h1 className="dash-page-title">{t("title")}</h1>
      <p className="dash-page-sub">{t("subtitle")}</p>
      <InboxView conversations={conversations} />
    </div>
  );
}
