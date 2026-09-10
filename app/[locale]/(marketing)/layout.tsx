import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Footer } from "@/components/marketing/Footer";
import "./marketing.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Markkinointisivujen kehys: header + sisältö + footer. Ei vaikuta URL:iin. */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`mkt ${inter.variable}`}>
      <MarketingHeader />
      {children}
      <Footer />
    </div>
  );
}
