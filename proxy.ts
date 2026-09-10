import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: entinen "middleware"-tiedostokäytäntö on nimeltään nyt "proxy".
export default createMiddleware(routing);

export const config = {
  // Kaikki paitsi API, Next.js:n sisäiset polut ja tiedostopäätteiset pyynnöt.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
