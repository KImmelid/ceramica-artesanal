import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { ToastProvider } from "./componentes/ToastProvider";
import SignOutButton from "./componentes/SignOutButton";
import { redirect } from "next/navigation";

const MENU = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/ventas", label: "Ventas" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/talleres", label: "Talleres" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authConfig);
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex bg-[#f8f4ef]">
      <ToastProvider />
      <aside className="w-64 shrink-0 border-r bg-white/95 backdrop-blur flex flex-col">
        <div className="px-6 py-6 border-b">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#c4623e] text-white grid place-items-center font-serif text-lg">
              CA
            </div>
            <div>
              <p className="text-sm text-neutral-500">Panel</p>
              <p className="font-semibold">Ceramica Artesanal</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 px-2">Gestion</p>
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-[#f3e7df] hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t text-sm text-neutral-600">
          Sesion activa como <span className="font-medium">{session?.user?.name ?? "Admin"}</span>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b bg-white/80 backdrop-blur flex items-center justify-between px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Panel</p>
            <p className="text-2xl font-serif">Administracion</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm underline">Ver sitio</Link>
            <span className="h-10 w-10 rounded-full bg-[#c4623e]/15 grid place-items-center text-[#c4623e] font-medium">
              {(session?.user?.name ?? "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
