import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LogoutButton } from "./LogoutButton";
import { clinic } from "@/lib/mock/data";

export async function Topbar() {
  const t = await getTranslations("Dashboard");
  const tAuth = await getTranslations("Auth");
  const session = await auth();
  const userName = session?.user?.name ?? t("user");
  const initials = userName
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
        <span className="dash-avatar" title={userName}>
          {initials}
        </span>
        <LogoutButton label={tAuth("logout")} />
      </div>
    </header>
  );
}
