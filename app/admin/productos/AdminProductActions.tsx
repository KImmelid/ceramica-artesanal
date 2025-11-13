"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EditModal from "./EditModal";
import type { ProductRow } from "./ClientTable";

export default function AdminProductActions({ product }: { product: ProductRow }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  async function eliminar() {
    if (!confirm("¿Eliminar producto?")) return;
    const res = await fetch(`/api/productos/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Producto eliminado");
      router.refresh();
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={() => setEditing(true)} className="text-sm underline text-blue-600">Editar</button>
      <button onClick={eliminar} className="text-sm underline text-red-600">Eliminar</button>
      {editing && (
        <EditModal
          product={product}
          onClose={() => setEditing(false)}
          onUpdated={() => { setEditing(false); router.refresh(); }}
        />
      )}
    </div>
  );
}
