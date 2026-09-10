"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  IconOverview,
  IconInbox,
  IconPhone,
  IconLeads,
  IconRobot,
  IconFlow,
  IconSettings,
} from "./icons";

const ITEMS = [
  { href: "/dashboard/overview", key: "overview", Icon: IconOverview },
  { href: "/dashboard/inbox", key: "inbox", Icon: IconInbox },
  { href: "/dashboard/calls", key: "calls", Icon: IconPhone },
  { href: "/dashboard/pipeline", key: "pipeline", Icon: IconLeads },
  { href: "/dashboard/ai-assistant", key: "aiAssistant", Icon: IconRobot },
  { href: "/dashboard/workflows", key: "workflows", Icon: IconFlow },
  { href: "/dashboard/settings", key: "settings", Icon: IconSettings },
] as const;

export function Sidebar() {
  const t = useTranslations("Nav");
  const tD = useTranslations("Dashboard");
  const pathname = usePathname(); // ilman locale-etuliitettä

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        Vahti&nbsp;AI
        <span className="dash-sidebar__badge">{tD("demoBadge")}</span>
      </div>

      <div className="dash-sidebar__section">{t("sectionMain")}</div>
      {ITEMS.map(({ href, key, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className="dash-nav-link"
            aria-current={active ? "page" : undefined}
          >
            <Icon />
            {t(key)}
          </Link>
        );
      })}

      <div className="dash-sidebar__foot">
        <Link href="/" className="dash-nav-link" style={{ padding: "0.4rem 0" }}>
          {t("backToSite")}
        </Link>
      </div>
    </aside>
  );
}
