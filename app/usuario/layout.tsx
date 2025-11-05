import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

const MENU = [
  { href: "/usuario", label: "Resumen" },
  { href: "/usuario/pedidos", label: "Pedidos" },
  { href: "/usuario/talleres", label: "Talleres" },
  { href: "/usuario/perfil", label: "Mi perfil" },
];

export default async function UsuarioLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authConfig);

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      <aside className="w-56 border-r bg-white">
        <div className="px-5 py-5 border-b">
          <p className="text-xs text-gray-500">Área del usuario</p>
          <h2 className="text-lg font-serif">Cerámica Artesanal</h2>
          <p className="mt-2 text-sm text-gray-600">{session?.user?.name ?? "Usuario"}</p>
        </div>
        <nav className="p-4 space-y-1 text-sm">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg hover:bg-[#F4EAE6] hover:text-[#C4623E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

