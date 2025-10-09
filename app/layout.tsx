import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerámica Artesanal",
  description: "Piezas únicas hechas a mano. Talleres y colección.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}
