import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Archivos públicos y rutas especiales que no se protegen
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$/.test(pathname);

  // Rutas de autenticación y API de NextAuth que deben quedar libres
  const isApiAuth = pathname.startsWith("/api/auth");
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  if (isPublicAsset || isApiAuth) {
    return NextResponse.next();
  }

  const SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  const token = await getToken({ req, secret: SECRET });
  const isLogged = !!token;

  const needsAuth = pathname.startsWith("/usuario");
  const isAdminRoute = pathname.startsWith("/admin");

  // Proteger sólo /usuario/* para usuarios autenticados
  if (needsAuth && !isLogged) {
    const url = new URL("/login", nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Usuario logueado intenta ver /login o /registro: envía al inicio
  if (isLogged && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Rutas admin: deben estar autenticadas y con rol ADMIN
  if (isAdminRoute) {
    if (!isLogged) {
      const url = new URL("/login", nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }
  }

  return NextResponse.next();
}

// Ejecuta middleware en toda la app excepto rutas estáticas y API
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
