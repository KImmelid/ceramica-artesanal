// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Fuerza runtime Node.js (evita Edge para Prisma/bcrypt)
export const runtime = "nodejs";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
