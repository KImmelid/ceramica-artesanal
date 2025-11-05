"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Workshop = { id: number; title: string; description: string | null; date: string; capacity: number };

export default function AdminTalleresPage() {
  const [items, setItems] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "", capacity: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/talleres");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Guardando...");
    const res = await fetch("/api/talleres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        date: form.date,         // ISO: "2025-11-04T10:00"
        capacity: Number(form.capacity),
      }),
    });
    if (res.ok) {
      setForm({ title: "", description: "", date: "", capacity: "" });
      setStatus("Creado con éxito.");
      await load();
      router.refresh();
    } else {
      setStatus("Error al guardar");
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar taller?")) return;
    const res = await fetch(`/api/talleres/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Talleres</h1>

      <form onSubmit={crear} className="grid grid-cols-1 md:grid-cols-5 gap-2 max-w-5xl">
        <input className="border p-2 rounded" placeholder="Título"
               value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Descripción"
               value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
        <input className="border p-2 rounded" type="datetime-local"
               value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Cupo" type="number"
               value={form.capacity} onChange={(e)=>setForm({...form, capacity:e.target.value})}/>
        <button className="rounded bg-[#C4623E] text-white px-3 py-2">Crear</button>
      </form>
      {status && <p className="text-sm text-gray-600">{status}</p>}

      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Título</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Cupo</th>
              <th className="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-3">Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-3 text-gray-500">No hay talleres.</td></tr>
            ) : items.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{new Date(t.date).toLocaleString()}</td>
                <td className="px-4 py-2">{t.capacity}</td>
                <td className="px-4 py-2">
                  <button onClick={()=>eliminar(t.id)} className="text-sm underline text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

