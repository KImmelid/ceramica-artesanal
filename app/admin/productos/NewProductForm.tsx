"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Errors = Partial<{ name: string; price: string; stock: string; image: string }>;

export default function NewProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", price: "", stock: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const errs: Errors = {};
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) errs.name = "El nombre es obligatorio";
    else if (name.length < 3) errs.name = "Mínimo 3 caracteres";

    if (!Number.isFinite(price)) errs.price = "Precio inválido";
    else if (price <= 0) errs.price = "Debe ser mayor a 0";

    if (!Number.isFinite(stock)) errs.stock = "Stock inválido";
    else if (!Number.isInteger(stock) || stock < 0) errs.stock = "Entero ≥ 0";

    if (form.image) {
      try {
        const parsed = new URL(
          form.image,
          typeof window !== "undefined" ? window.location.href : "http://localhost"
        );
        const isData = form.image.startsWith("data:");
        const allowed = ["http:", "https:"].includes(parsed.protocol);
        if (!isData && !allowed) {
          errs.image = "URL de imagen inválida";
        }
      } catch {
        errs.image = "URL de imagen inválida";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Revisa los datos del formulario");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Producto creado");
      setForm({ name: "", price: "", stock: "", image: "" });
      router.refresh();
    } catch {
      toast.error("No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  }

  const preview = useMemo(() => {
    if (!form.image) return null;
    try {
      // permite data URLs y http(s)
      const url = new URL(form.image, typeof window !== "undefined" ? window.location.href : undefined);
      if (["http:", "https:"].includes(url.protocol) || form.image.startsWith("data:")) {
        return form.image;
      }
    } catch {}
    return null;
  }, [form.image]);

  return (
    <form onSubmit={crear} className="grid grid-cols-1 md:grid-cols-5 gap-2 max-w-5xl items-start">
      <div className="md:col-span-1">
        <input
          className="w-full input"
          placeholder="Nombre"
          aria-invalid={!!errors.name}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          className="w-full input"
          placeholder="Precio"
          type="number"
          step="0.01"
          min="0"
          aria-invalid={!!errors.price}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
      </div>
      <div>
        <input
          className="w-full input"
          placeholder="Stock"
          type="number"
          min="0"
          step="1"
          aria-invalid={!!errors.stock}
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
      </div>
      <div className="md:col-span-1">
        <input
          className="w-full input"
          placeholder="URL imagen (opcional)"
          aria-invalid={!!errors.image}
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded bg-[#C4623E] text-white px-3 py-2" disabled={saving}>
          {saving ? "Creando..." : "Crear"}
        </button>
      </div>
      {preview ? (
        <div className="md:col-span-5 mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Vista previa de imagen" className="h-24 rounded border" />
        </div>
      ) : null}
    </form>
  );
}
