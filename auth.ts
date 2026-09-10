import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDbAvailable } from "@/lib/db";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth-constants";

/**
 * GÖREV C — Auth.js (NextAuth v5), email + salasana (Credentials).
 *
 * Kaksi polkua:
 *  1. Oikea käyttäjä `Kullanici`-taulusta (bcrypt-tarkistus) — jos DB on.
 *  2. Demo-tunnukset, jotka toimivat AINA (myös ilman tietokantaa), jotta
 *     hallintapaneelin voi avata demossa:  demo@vahti.ai / demo1234
 *
 * Session-strategia on JWT (Credentials vaatii sen).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Sähköposti", type: "email" },
        password: { label: "Salasana", type: "password" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;

        // 1) Oikea käyttäjä tietokannasta
        if (await isDbAvailable()) {
          try {
            const user = await prisma.kullanici.findUnique({ where: { email } });
            if (
              user?.passwordHash &&
              (await bcrypt.compare(password, user.passwordHash))
            ) {
              return {
                id: user.id,
                email: user.email,
                name: user.ad,
                role: user.rol,
              };
            }
          } catch (err) {
            console.warn("[auth] DB-tarkistus epäonnistui:", err);
          }
        }

        // 2) Demo-tunnukset
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          return {
            id: "demo",
            email: DEMO_EMAIL,
            name: "Demo Käyttäjä",
            role: "omistaja",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: string }).role ?? "uye";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid ?? "");
        session.user.role = String(token.role ?? "uye");
      }
      return session;
    },
  },
});
