"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import EditModal from "./EditModal";

type Product = { id: number; name: string; price: number; stock: number; createdAt: string };

export default function AdminProductosPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/productos");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar producto?")) return;
    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Producto eliminado");
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-serif">Productos</h1>

      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-3 text-gray-500">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-3 text-gray-500">Sin productos</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">${p.price}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-sm underline text-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(p.id)}
                      className="text-sm underline text-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onUpdated={load}
        />
      )}
    </div>
  );
}
