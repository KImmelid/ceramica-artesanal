"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ToastGlobal from "@/components/ToastGlobal";
import AuthSheetProvider from "@/components/auth/AuthSheetProvider";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname === "/login" || pathname === "/registro";
  return (
    <AuthSheetProvider>
      {!isAdmin && !isAuth && <Navbar />}
      {/* En paginas publicas, anade enlace para saltar contenido y landmark */}
      {!isAdmin && !isAuth ? (
        <>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute left-2 top-2 bg-white border px-2 py-1 z-50">Saltar al contenido</a>
          <main id="contenido">{children}</main>
        </>
      ) : (
        children
      )}
      {!isAdmin && !isAuth && <Footer />}
      {/* Drawer global */}
      <CartDrawer />
      {/* Toasts globales para el sitio publico */}
      {!isAdmin && !isAuth && <ToastGlobal />}
    </AuthSheetProvider>
  );
}
