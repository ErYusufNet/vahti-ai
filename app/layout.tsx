import type { ReactNode } from "react";

/**
 * Juurilayout. Varsinainen <html>/<body> renderöidään kielikohtaisessa
 * layoutissa (app/[locale]/layout.tsx); tämä vain välittää lapset eteenpäin.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
