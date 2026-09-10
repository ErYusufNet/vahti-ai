import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <section className="hero">
      <h1>{t("title")}</h1>
      <p className="lead">{t("tagline")}</p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            padding: "0.6rem 1.2rem",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {t("openDashboard")} →
        </Link>
      </p>
      <p className="note">{t("scaffoldNote")}</p>
    </section>
  );
}
