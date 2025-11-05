"use client";

import { useState } from "react";

export default function EditModal({ product, onClose, onUpdated }: any) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/productos/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    setSaving(false);
    if (res.ok) {
      onUpdated();
      onClose();
    } else {
      alert("Error al actualizar producto");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px]">
        <h2 className="text-lg font-serif mb-3">Editar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre"
          />
          <input
            className="w-full border p-2 rounded"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Precio"
          />
          <input
            className="w-full border p-2 rounded"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-sm underline">
              Cancelar
            </button>
            <button
              disabled={saving}
              className="bg-[#C4623E] text-white rounded px-3 py-1.5"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
