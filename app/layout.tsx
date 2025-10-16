import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = { title: "Cerámica Artesanal", description: "..." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
