"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ProductRow } from "./ClientTable";

type EditModalProps = {
  product: ProductRow;
  onClose: () => void;
  onUpdated: () => void;
};

type ProductForm = {
  name: string;
  price: string;
  stock: string;
  image: string;
};

type FormErrors = Partial<Record<keyof ProductForm, string>>;

export default function EditModal({ product, onClose, onUpdated }: EditModalProps) {
  const [form, setForm] = useState<ProductForm>({
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    image: product.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate() {
    const errs: FormErrors = {};
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!name) errs.name = "El nombre es obligatorio";
    if (!Number.isFinite(price) || price <= 0) errs.price = "Precio invalido";
    if (!Number.isInteger(stock) || stock < 0) errs.stock = "Stock invalido";
    if (form.image) {
      try {
        const parsed = new URL(
          form.image,
          typeof window !== "undefined" ? window.location.href : "http://localhost"
        );
        const isData = form.image.startsWith("data:");
        const allowedProtocol = ["http:", "https:"].includes(parsed.protocol);
        if (!isData && !allowedProtocol) {
          errs.image = "URL de imagen invalida";
        }
      } catch {
        errs.image = "URL de imagen invalida";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Revisa los datos");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || null,
    };
    const res = await fetch(`/api/productos/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Producto actualizado");
      onUpdated();
      onClose();
    } else {
      toast.error("Error al actualizar producto");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px]">
        <h2 className="text-lg font-serif mb-3">Editar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              className="w-full input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nombre"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              className="w-full input"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Precio"
              aria-invalid={!!errors.price}
            />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <input
              className="w-full input"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="Stock"
              aria-invalid={!!errors.stock}
            />
            {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
          </div>
          <div>
            <input
              className="w-full input"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="URL imagen (opcional)"
              aria-invalid={!!errors.image}
            />
            {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="Vista previa" className="h-24 mt-2 rounded border" />
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-sm underline">
              Cancelar
            </button>
            <button disabled={saving} className="bg-[#C4623E] text-white rounded px-3 py-1.5">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
