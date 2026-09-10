import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import "./auth.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** GÖREV C — kirjautumissivujen kehys (oma minimaalinen ulkoasu). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`auth ${inter.variable}`}>
      <header className="auth__top">
        <Link href="/" className="auth__brand">
          <span className="auth__dot" />
          Vahti&nbsp;AI
        </Link>
        <LocaleSwitcher />
      </header>
      <main className="auth__main">{children}</main>
    </div>
  );
}
