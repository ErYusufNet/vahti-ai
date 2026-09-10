import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Kielitietoiset Link-/router-apurit (kielen etuliite hoidetaan automaattisesti). */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
