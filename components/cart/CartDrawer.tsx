"use client";
import { useCart } from "@/components/cart/CartProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export default function CartDrawer() {
  const { items, total, remove, clear, open, closeDrawer, inc, dec, setQty } = useCart();
  const { data: session } = useSession();

  async function comprar() {
    if (!session) {
      window.location.href = "/login?callbackUrl=/carrito";
      return;
    }
    const payload = {
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      status: "pagado",
    };
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Compra registrada. ¡Gracias!");
      clear();
      closeDrawer();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "No se pudo registrar la compra");
    }
  }

  return (
    <>
      {open && (
        <>
          <div onClick={closeDrawer} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white/95 z-50 border-l flex flex-col shadow-[0_15px_60px_rgba(20,17,15,0.2)]"
            style={{ borderColor: "#E4E4E7" }}
          >
            <header className="h-16 border-b flex items-center justify-between px-5" style={{ borderColor: "#E4E4E7" }}>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Carrito</p>
                <h2 id="cart-title" className="font-serif text-xl">Tus piezas seleccionadas</h2>
              </div>
              <button
                aria-label="Cerrar carrito"
                className="h-9 w-9 rounded-full border grid place-items-center hover:bg-neutral-50"
                style={{ borderColor: "#E4E4E7" }}
                onClick={closeDrawer}
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="panel-muted text-center text-neutral-600">
                  <p className="font-serif text-lg mb-1">Tu carrito está vacío</p>
                  <p className="text-sm">Explora la tienda y agrega tus piezas favoritas.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((i) => (
                    <li key={i.id} className="rounded-2xl border bg-white/90 p-4 flex gap-3" style={{ borderColor: "#E4E4E7" }}>
                      <div className="h-16 w-16 rounded-xl bg-[#f8f4ef] grid place-items-center text-sm text-neutral-500">
                        <Image src="/logo-presentacion.png" alt="" width={36} height={36} className="object-contain opacity-70" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium truncate">{i.name}</p>
                        <p className="text-sm text-neutral-500">
                          {currency.format(i.price)} c/u {i.stock != null ? `• ${i.stock} disponibles` : ""}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900">{currency.format(i.price * i.qty)}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="flex items-center rounded-full bg-neutral-100 px-2 py-1">
                          <button aria-label="Disminuir" className="px-2 text-lg" onClick={() => dec(i.id)} disabled={i.qty <= 1}>
                            –
                          </button>
                          <input
                            aria-label="Cantidad"
                            className="w-12 text-center bg-transparent border-none outline-none"
                            type="number"
                            min={1}
                            max={i.stock ?? undefined}
                            value={i.qty}
                            onChange={(e) => setQty(i.id, Number(e.target.value))}
                          />
                          <button aria-label="Aumentar" className="px-2 text-lg" onClick={() => inc(i.id)} disabled={i.stock != null && i.qty >= i.stock}>
                            +
                          </button>
                        </div>
                        <button className="text-xs underline text-neutral-500" onClick={() => remove(i.id)}>
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t p-5 space-y-4 bg-white/95" style={{ borderColor: "#E4E4E7" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Total</span>
                <span className="text-2xl font-serif">{currency.format(total)}</span>
              </div>
              <div className="grid gap-2">
                <Link href="/carrito" onClick={closeDrawer} className="btn btn-outline w-full text-center">
                  Ver detalle
                </Link>
                <div className="flex gap-2">
                  <button className="btn btn-outline flex-1" onClick={clear}>
                    Vaciar
                  </button>
                  <button className="btn btn-primary flex-1" onClick={comprar} disabled={items.length === 0}>
                    Comprar ahora
                  </button>
                </div>
              </div>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}
