import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

const MENU = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/ventas", label: "Ventas" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/talleres", label: "Talleres" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authConfig);

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r bg-white">
        <div className="px-5 py-4 border-b">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#C4623E] text-white font-semibold">
            CA
          </div>
          <p className="mt-3 text-sm text-gray-500">Panel administrativo</p>
        </div>

        <nav className="p-4 space-y-1">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Gestión
          </p>
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm hover:bg-[#F4EAE6] hover:text-[#C4623E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-6">
          <div>
            <h1 className="text-sm text-gray-500">Administración</h1>
            <p className="text-lg font-semibold">Cerámica Artesanal</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {session?.user?.name ?? "Admin"}
            </span>
            <span className="h-8 w-8 rounded-full bg-[#C4623E]/10 grid place-items-center text-[#C4623E] font-medium">
              {(session?.user?.name ?? "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

