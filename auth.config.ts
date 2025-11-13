// auth.config.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";

// ðŸ‘‡ no tipamos con NextAuthConfig porque tu versiÃ³n no lo exporta
const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "ContraseÃ±a", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // lo que va al JWT
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AdapterUser & { role?: string | null };
        token.role = u.role ?? "USER";
        token.uid = u.id ?? token.uid;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token as JWT).role || "USER";
        session.user.id = (token as JWT).uid;
      }
      return session;
    },
  },
  // si quieres luego pones pages: { signIn: "/login" }
};

export default authConfig;

