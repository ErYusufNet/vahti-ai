import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

/** /dashboard → /dashboard/overview */
export default async function DashboardIndex() {
  const locale = await getLocale();
  redirect({ href: "/dashboard/overview", locale });
}
