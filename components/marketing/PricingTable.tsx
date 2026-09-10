import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  PLAN_ORDER,
  POPULAR_PLAN,
  PRICING_ROWS,
  planIncludes,
  type PlanId,
} from "@/lib/pricing";

/**
 * Jaettu hinnoittelun vertailutaulukko. `featuredOnly` = tiivistetty versio
 * (laskeutumissivu); ilman sitä kaikki rivit (/pricing).
 */
export async function PricingTable({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const t = await getTranslations("Pricing");
  const rows = featuredOnly ? PRICING_ROWS.filter((r) => r.featured) : PRICING_ROWS;

  const price: Record<PlanId, string> = {
    essential: t("priceEssential"),
    professional: t("priceProfessional"),
    business: t("priceBusiness"),
    enterprise: t("priceEnterprise"),
  };
  const planName = (p: PlanId) =>
    t(`plan${p[0].toUpperCase()}${p.slice(1)}` as "planEssential");

  const yes = <span className="yes">{t("yes")}</span>;
  const no = <span>{t("no")}</span>;

  return (
    <div className="mkt-pricing-wrap">
      <table className="mkt-pricing">
        <colgroup>
          <col />
          {PLAN_ORDER.map((p) => (
            <col key={p} className={p === POPULAR_PLAN ? "is-popular" : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th />
            {PLAN_ORDER.map((p) => (
              <th key={p} className={p === POPULAR_PLAN ? "is-popular" : undefined}>
                {p === POPULAR_PLAN && (
                  <span className="mkt-pill-popular">{t("popular")}</span>
                )}
                <div className="mkt-plan__name">{planName(p)}</div>
                <div
                  className="mkt-plan__price"
                  style={p === "enterprise" ? { fontSize: "1.15rem" } : undefined}
                >
                  {price[p]}
                  {p !== "enterprise" && (
                    <span className="mkt-plan__per"> {t("perMonth")}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{t(row.label)}</th>
              {PLAN_ORDER.map((p) => (
                <td key={p} className={p === POPULAR_PLAN ? "is-popular" : undefined}>
                  {row.kind === "bool"
                    ? planIncludes(row.from, p)
                      ? yes
                      : no
                    : t(row.values[p])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="cta-row">
            <td />
            {PLAN_ORDER.map((p) => (
              <td key={p} className={p === POPULAR_PLAN ? "is-popular" : undefined}>
                {p === "enterprise" ? (
                  <a href="#contact" className="mkt-btn mkt-btn--light mkt-btn--sm">
                    {t("ctaEnterprise")}
                  </a>
                ) : (
                  <Link
                    href="/signup"
                    className={`mkt-btn mkt-btn--sm ${
                      p === POPULAR_PLAN ? "mkt-btn--primary" : "mkt-btn--light"
                    }`}
                  >
                    {t("cta")}
                  </Link>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mkt-pricing__vat">{t("vat")}</p>
    </div>
  );
}
