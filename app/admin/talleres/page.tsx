"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Workshop = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  capacity: number;
  open?: boolean;
  _count?: { enrollments: number };
};

export default function AdminTalleresPage() {
  const [items, setItems] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", capacity: "" });
  const [status, setStatus] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "abiertos" | "cerrados">("todos");
  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/talleres", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch {
      setItems([]);
      setError("No se pudo cargar la lista de talleres.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Guardando...");
    const res = await fetch("/api/talleres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        date: form.date, // "2025-11-04T10:00"
        capacity: Number(form.capacity),
      }),
    });
    if (res.ok) {
      setForm({ title: "", description: "", date: "", capacity: "" });
      setStatus("Creado con exito.");
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

  async function toggleOpen(id: number, next: boolean) {
    const res = await fetch(`/api/talleres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ open: next }),
    });
    if (res.ok) {
      await load();
      router.refresh();
    } else {
      alert("No se pudo cambiar el estado");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Talleres</h1>

      <form onSubmit={crear} className="admin-talleres-form grid grid-cols-1 md:grid-cols-5 gap-2 max-w-5xl">
        <input
          className="input"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="input"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="input"
          placeholder="Cupo"
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <button className="rounded bg-[#C4623E] text-white px-3 py-2">Crear</button>
      </form>
      {status && <p className="text-sm text-gray-600">{status}</p>}

      <div className="flex items-center gap-3 text-sm">
        <label>Estado:</label>
        <select
          className="input"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as "todos" | "abiertos" | "cerrados")}
        >
          <option value="todos">Todos</option>
          <option value="abiertos">Abiertos</option>
          <option value="cerrados">Cerrados</option>
        </select>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Título</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Aviso</th>
              <th className="text-left px-4 py-2">Cupo</th>
              <th className="text-left px-4 py-2">Estado</th>
              <th className="text-left px-4 py-2">Disponibles</th>
              <th className="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-3">
                  <div className="flex gap-3">
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-4 w-24" />
                    <div className="skeleton h-4 w-16" />
                    <div className="skeleton h-4 w-20" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-red-600">
                  {error}
                  <button
                    className="ml-3 text-sm underline text-[#C4623E]"
                    onClick={() => load()}
                  >
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-gray-500">
                  No hay talleres.
                </td>
              </tr>
            ) : (
              items
                .filter((t) =>
                  filtro === "todos" ? true : filtro === "abiertos" ? (t.open ?? true) : !(t.open ?? true)
                )
                .map((t) => {
                  const now = Date.now();
                  const ts = new Date(t.date).getTime();
                  const soon = ts > now && ts - now <= 2 * 60 * 60 * 1000; // < 2h
                  const disponibles = Math.max(0, Number(t.capacity) - Number(t._count?.enrollments ?? 0));
                  return (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-2">{t.title}</td>
                      <td className="px-4 py-2">{new Date(t.date).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        {soon ? (<span className="badge badge-warning">Cierra pronto</span>) : null}
                      </td>
                      <td className="px-4 py-2">{t.capacity}</td>
                      <td className="px-4 py-2">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={t.open ?? true}
                            onChange={(e) => toggleOpen(t.id, e.target.checked)}
                          />
                          <span>{(t.open ?? true) ? "Abierto" : "Cerrado"}</span>
                        </label>
                      </td>
                      <td className="px-4 py-2">{disponibles}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => eliminar(t.id)}
                          className="text-sm underline text-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


