import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table from "../componentes/Table";

async function fetchProductos(searchParams: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  ["q", "sort", "page", "perPage"].forEach((k) => {
    const v = searchParams[k];
    if (typeof v === "string") sp.set(k, v);
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/productos?` + sp.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar productos");
  return res.json() as Promise<{ meta: { page: number; pages: number }; rows: any[] }>;
}

export default async function AdminProductosPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const data = await fetchProductos(searchParams);
  const columns = [
    { key: "name", header: "Nombre" },
    { key: "price", header: "Precio", render: (p: any) => `$${p.price}` },
    { key: "stock", header: "Stock" },
    { key: "createdAt", header: "Creado", render: (p: any) => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-serif">Productos</h1>
      <FiltersBar placeholders={{ q: "Buscar por nombre o id..." }} />
      <div className="flex items-center gap-2 text-sm">
        <a href="?sort=date_desc" className="underline">Fecha ↓</a>
        <a href="?sort=date_asc" className="underline">Fecha ↑</a>
        <a href="?sort=price_desc" className="underline">Precio ↓</a>
        <a href="?sort=price_asc" className="underline">Precio ↑</a>
        <a href="?sort=stock_desc" className="underline">Stock ↓</a>
        <a href="?sort=stock_asc" className="underline">Stock ↑</a>
      </div>
      <Table columns={columns as any} rows={data.rows} />
      <Pagination page={data.meta.page} pages={data.meta.pages} />
    </div>
  );
}

