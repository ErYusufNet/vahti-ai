import type { ReactNode } from "react";
import { Header } from "@/components/Header";

/** Markkinointisivujen kehys (etusivu). Ei vaikuta URL-osoitteeseen. */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
    </>
  );
}
