import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLogged = !!req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isUserRoute  = nextUrl.pathname.startsWith("/usuario");

  // No logueado → redirige a login con callback
  if ((isAdminRoute || isUserRoute) && !isLogged) {
    const url = new URL("/login", nextUrl.origin);
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Rutas admin: exige role ADMIN
  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/usuario/:path*"],
};
    