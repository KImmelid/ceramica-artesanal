"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = { id: number; name: string; price: number; stock: number; createdAt: string };

export default function AdminProductosPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/productos");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Guardando...");
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    if (res.ok) {
      setForm({ name: "", price: "", stock: "" });
      setStatus("Creado con éxito.");
      await load();
      router.refresh();
    } else {
      setStatus("Error al guardar");
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar producto?")) return;
    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Productos</h1>

      <form onSubmit={crear} className="grid grid-cols-1 md:grid-cols-4 gap-2 max-w-3xl">
        <input className="border p-2 rounded" placeholder="Nombre"
               value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Precio" type="number"
               value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Stock" type="number"
               value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})}/>
        <button className="rounded bg-[#C4623E] text-white px-3 py-2">Crear</button>
      </form>
      {status && <p className="text-sm text-gray-600">{status}</p>}

      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Precio</th>
              <th className="text-left px-4 py-2">Stock</th>
              <th className="text-left px-4 py-2">Creado</th>
              <th className="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-3">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-3 text-gray-500">No hay productos.</td></tr>
            ) : items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button onClick={()=>eliminar(p.id)} className="text-sm underline text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

