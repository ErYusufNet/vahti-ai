import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Vahti&nbsp;AI
      </Link>
      <div className="site-header__right">
        <span className="site-header__tagline">{t("tagline")}</span>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
