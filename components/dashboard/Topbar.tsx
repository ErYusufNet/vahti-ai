import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { clinic } from "@/lib/mock/data";

export async function Topbar() {
  const t = await getTranslations("Dashboard");
  const initials = t("user")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="dash-topbar">
      <span className="dash-topbar__clinic">{clinic.ad}</span>
      <div className="dash-topbar__right">
        <LocaleSwitcher />
        <span className="dash-avatar" title={t("user")}>
          {initials}
        </span>
      </div>
    </header>
  );
}
