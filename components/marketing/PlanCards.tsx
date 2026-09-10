import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PLAN_ORDER, POPULAR_PLAN, type PlanId } from "@/lib/pricing";

/** 4 pakettikorttia (/pricing-sivun yläosa). */
export async function PlanCards() {
  const t = await getTranslations("Pricing");

  const cap = (p: PlanId) => `${p[0].toUpperCase()}${p.slice(1)}`;

  return (
    <div className="mkt-plan-cards">
      {PLAN_ORDER.map((p) => {
        const popular = p === POPULAR_PLAN;
        return (
          <div key={p} className={`mkt-plan-card ${popular ? "is-popular" : ""}`}>
            {popular && <span className="mkt-pill-popular">{t("popular")}</span>}
            <div className="mkt-plan-card__name">
              {t(`plan${cap(p)}` as "planEssential")}
            </div>
            <div className="mkt-plan-card__price">
              {t(`price${cap(p)}` as "priceEssential")}
              {p !== "enterprise" && (
                <span className="mkt-plan__per"> {t("perMonth")}</span>
              )}
            </div>
            <p className="mkt-plan-card__desc">
              {t(`desc${cap(p)}` as "descEssential")}
            </p>
            {p === "enterprise" ? (
              <a href="#contact" className="mkt-btn mkt-btn--light">
                {t("ctaEnterprise")}
              </a>
            ) : (
              <Link
                href="/signup"
                className={`mkt-btn ${popular ? "mkt-btn--primary" : "mkt-btn--light"}`}
              >
                {t("cta")}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
