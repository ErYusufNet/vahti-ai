import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import "./dashboard.css";

/**
 * Hallintapaneelin runko. GÖREV C: pääsy vaatii kirjautumisen — ilman
 * istuntoa ohjataan /login-sivulle.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
  }

  return (
    <div className="dash">
      <Sidebar />
      <div className="dash-main">
        <Topbar />
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
