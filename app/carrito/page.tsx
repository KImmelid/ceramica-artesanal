"use client";
import { useCart } from "@/components/cart/CartProvider";
import { useSession } from "next-auth/react";

export default function CarritoPage() {
  const { items, total, remove, clear } = useCart();
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
      // Opcional: redirigir a área usuario
      window.location.href = "/usuario";
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "No se pudo registrar la compra");
    }
  }

  return (
    <div className="section container max-w-2xl">
      <h1 className="text-2xl font-serif mb-4">Carrito</h1>
      {items.length === 0 ? (
        <p className="text-neutral-600">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          <ul className="divide-y">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-neutral-600">{i.qty} × ${i.price.toLocaleString("es-AR")}</p>
                </div>
                <button className="text-sm underline" onClick={() => remove(i.id)}>Quitar</button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total: ${total.toLocaleString("es-AR")}</span>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={clear}>Vaciar</button>
              <button className="btn btn-primary" onClick={comprar}>Comprar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
