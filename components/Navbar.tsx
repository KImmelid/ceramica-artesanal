"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import { useEffect, useRef, useState } from "react";
import { useAuthSheet } from "@/components/auth/AuthSheetProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { count, openDrawer } = useCart();
  const { open: openAuthSheet } = useAuthSheet();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "#E4E4E7" }}>
      <div className="mx-auto max-w-[1280px] px-4 flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-presentacion.svg"
            alt="Ceramica Artesanal"
            width={36}
            height={36}
            priority
          />
          <span className="font-serif text-xl">Ceramica Artesanal</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Menu desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="menu-popover"
              onClick={() => setMenuOpen((v) => !v)}
              id="menu-trigger"
              className="h-9 w-9 rounded-full border grid place-items-center hover:bg-neutral-50"
              style={{ borderColor: "#E4E4E7" }}
            >
              {/* Icono hamburguesa */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            {menuOpen && (
              <div
                role="menu"
                id="menu-popover"
                aria-labelledby="menu-trigger"
                className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-card overflow-hidden"
                style={{ borderColor: "#E4E4E7" }}
              >
                <div className="py-1 text-sm">
                  {/* Publico */}
                  <MenuItem href="/talleres" onSelect={() => setMenuOpen(false)} label="Explorar talleres" />
                  <button
                    role="menuitem"
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-50"
                    onClick={() => { setMenuOpen(false); openDrawer(); }}
                  >
                    Carrito{count ? ` (${count})` : ""}
                  </button>
                  <div className="my-1 border-t" style={{ borderColor: "#E4E4E7" }} />
                  {!session && (
                    <>
                      <button
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 hover:bg-neutral-50"
                        onClick={() => { setMenuOpen(false); openAuthSheet("login"); }}
                      >
                        Iniciar sesion
                      </button>
                      <button
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 hover:bg-neutral-50"
                        onClick={() => { setMenuOpen(false); openAuthSheet("register"); }}
                      >
                        Registrarse
                      </button>
                    </>
                  )}

                  {session && (
                    <>
                      <MenuItem href="/usuario/perfil" onSelect={() => setMenuOpen(false)} label="Mi perfil" />
                      {isAdmin && <MenuItem href="/admin" onSelect={() => setMenuOpen(false)} label="Panel administrativo" />}
                      <button
                        role="menuitem"
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50"
                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      >
                        Cerrar sesion
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ href, label, onSelect }: { href: string; label: string; onSelect?: () => void }) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onSelect}
      className="block px-4 py-2 hover:bg-neutral-50"
    >
      {label}
    </Link>
  );
}
