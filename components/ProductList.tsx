"use client";
import { useCart } from "@/components/cart/CartProvider";
import { toast } from "sonner";

export type ProductListItem = { id: number; name: string; price: number; stock: number; image?: string | null };

export default function ProductList({ products }: { products: ProductListItem[] }) {
  const { add, openDrawer } = useCart();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p) => {
        const sinStock = p.stock <= 0;
        const price = Number(p.price);
        return (
          <article key={p.id} className="card flex flex-col gap-3 group">
            <div className="relative h-40 rounded-2xl bg-[#f8f2ed] grid place-items-center overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="max-h-32 object-contain transition duration-300 group-hover:scale-105" />
              ) : (
                <span className="text-neutral-400 text-sm">Sin imagen</span>
              )}
              <div className="absolute left-4 top-4 pill text-[11px] py-0.5 px-2">
                <span className="pill-dot" aria-hidden="true" />
                <span>{sinStock ? "Por encargo" : "En stock"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-medium text-lg">{p.name}</h3>
              <p className="text-sm text-neutral-500">{sinStock ? "Proxima hornada" : "Listo para envio"}</p>
              <p className="text-xl font-serif mt-1">${price.toLocaleString("es-AR")}</p>
            </div>
            <button
              className="btn btn-primary mt-auto disabled:opacity-50"
              disabled={sinStock}
              onClick={() => {
                add({ id: p.id, name: p.name, price, stock: p.stock });
                toast.success("Producto agregado al carrito");
                openDrawer();
              }}
            >
              {sinStock ? "Sin stock" : "Agregar al carrito"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
