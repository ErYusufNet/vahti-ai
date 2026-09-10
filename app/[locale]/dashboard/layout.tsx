import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import "./dashboard.css";

/** Hallintapaneelin runko: kiinteä sivupalkki + yläpalkki + sisältöalue. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
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
