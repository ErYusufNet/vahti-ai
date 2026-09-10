import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Jaettu markkinointisivujen footer. */
export async function Footer() {
  const t = await getTranslations("Landing.footer");

  return (
    <footer className="mkt-footer" id="contact">
      <div className="mkt-shell">
        <div className="mkt-footer__grid">
          <div>
            <div className="mkt-footer__brand">
              <span className="mkt-brand__dot" />
              Vahti&nbsp;AI
            </div>
            <p className="mkt-footer__tagline">{t("tagline")}</p>
          </div>
          <div>
            <h4>{t("colProduct")}</h4>
            <ul>
              <li>
                <Link href="/">{t("linkFeatures")}</Link>
              </li>
              <li>
                <Link href="/pricing">{t("linkPricing")}</Link>
              </li>
              <li>
                <Link href="/for-clinics">Vahti AI + klinikat</Link>
              </li>
              <li>
                <Link href="/dashboard">{t("linkDashboard")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t("colCompany")}</h4>
            <ul>
              <li>
                <a href="#">{t("linkAbout")}</a>
              </li>
              <li>
                <a href="#contact">{t("linkContact")}</a>
              </li>
              <li>
                <a href="#">{t("linkCareers")}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t("colLegal")}</h4>
            <ul>
              <li>
                <a href="#">{t("linkPrivacy")}</a>
              </li>
              <li>
                <a href="#">{t("linkTerms")}</a>
              </li>
              <li>
                <a href="#">{t("linkGdpr")}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mkt-footer__bottom">
          <span>{t("rights")}</span>
          <span>{t("demoNote")}</span>
        </div>
      </div>
    </footer>
  );
}
