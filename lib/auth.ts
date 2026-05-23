import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

type AppRole = "ADMIN" | "EDITOR";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: AppRole;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const isProduction = process.env.NODE_ENV === "production";

// Auth.js v5 reads AUTH_SECRET automatically. We surface a loud error in
// production if it's missing so the app fails fast instead of silently
// signing JWTs with an empty secret.
if (isProduction && !process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` " +
      "and add it to your production environment."
  );
}

/**
 * Auth.js v5 configuration. We deliberately use JWT sessions (not DB sessions)
 * so middleware on the Edge can read the session without hitting Postgres on
 * every request. The PrismaAdapter is still wired up so that future providers
 * (OAuth, magic links) can persist account links if we add them later.
 *
 * Security knobs that depend on the deployment:
 * - `trustHost: true` — required when running behind a reverse proxy (Nginx,
 *   aaPanel, Vercel, etc) so Auth.js trusts the forwarded host header.
 * - `useSecureCookies: isProduction` — forces the `__Secure-` cookie prefix +
 *   `Secure` flag in production. Your reverse proxy MUST serve HTTPS for this
 *   to work; otherwise the cookie will not be set and login will silently fail.
 * - `cookies.sessionToken.options.sameSite: "lax"` — safe default that works
 *   with same-site form posts (our login form) and blocks CSRF from other
 *   origins. Auth.js already enables CSRF protection on its endpoints.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  trustHost: true,
  useSecureCookies: isProduction,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          image: user.avatarUrl ?? null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        (token as { role?: AppRole }).role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.sub) session.user.id = token.sub;
      const role = (token as { role?: AppRole }).role;
      if (role) session.user.role = role;
      return session;
    },
  },
});
