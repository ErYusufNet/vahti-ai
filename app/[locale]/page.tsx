import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <section className="hero">
      <h1>{t("title")}</h1>
      <p className="lead">{t("tagline")}</p>
      <p className="note">{t("scaffoldNote")}</p>
    </section>
  );
}
