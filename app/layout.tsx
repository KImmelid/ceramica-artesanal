import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import AppChrome from "@/components/AppChrome";
import CartProvider from "@/components/cart/CartProvider";

export const metadata: Metadata = { title: "Cerámica Artesanal", description: "" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <SessionProvider>
          <CartProvider>
            <AppChrome>{children}</AppChrome>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
