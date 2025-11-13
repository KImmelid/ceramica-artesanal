export type ProductPayload = {
  name?: string;
  price?: number;
  stock?: number;
  image?: string | null;
};

type ValidationResult =
  | { ok: true; data: ProductPayload }
  | { ok: false; errors: Record<string, string> };

export function validateProduct(raw: unknown, opts: { partial?: boolean } = {}): ValidationResult {
  const partial = Boolean(opts.partial);
  const errors: Record<string, string> = {};
  const out: ProductPayload = {};
  const source = (raw ?? {}) as Record<string, unknown>;

  if (!partial || source.name !== undefined) {
    const name = String(source.name ?? "").trim();
    if (!name) errors.name = "El nombre es obligatorio";
    else if (name.length < 3) errors.name = "Minimo 3 caracteres";
    else out.name = name;
  }

  if (!partial || source.price !== undefined) {
    const price = Number(source.price);
    if (!Number.isFinite(price)) errors.price = "Precio invalido";
    else if (price <= 0) errors.price = "Debe ser mayor a 0";
    else out.price = price;
  }

  if (!partial || source.stock !== undefined) {
    const stock = Number(source.stock);
    if (!Number.isFinite(stock)) errors.stock = "Stock invalido";
    else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Entero >= 0";
    else out.stock = stock;
  }

  if (!partial || source.image !== undefined) {
    const image = source.image;
    if (image == null || image === "") {
      out.image = null;
    } else if (typeof image === "string") {
      try {
        const parsed = new URL(image, "http://localhost");
        if (image.startsWith("data:") || ["http:", "https:"].includes(parsed.protocol)) {
          out.image = image;
        } else {
          errors.image = "URL de imagen invalida";
        }
      } catch {
        errors.image = "URL de imagen invalida";
      }
    } else {
      errors.image = "URL de imagen invalida";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: out };
}
