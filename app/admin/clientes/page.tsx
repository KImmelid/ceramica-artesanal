import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table from "../componentes/Table";

async function fetchClientes(searchParams: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  ["q", "sort", "page", "perPage"].forEach((k) => {
    const v = searchParams[k];
    if (typeof v === "string") sp.set(k, v);
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/clientes?` + sp.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar clientes");
  return res.json() as Promise<{ meta: { page: number; pages: number }; rows: any[] }>;
}

export default async function AdminClientesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const data = await fetchClientes(searchParams);
  const columns = [
    { key: "name", header: "Nombre", render: (c: any) => c.name ?? "—" },
    { key: "email", header: "Email", render: (c: any) => c.email ?? "—" },
    { key: "role", header: "Rol" },
    { key: "createdAt", header: "Registrado", render: (c: any) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-serif">Clientes</h1>
      <FiltersBar placeholders={{ q: "Buscar por nombre, email o id..." }} />
      <div className="flex items-center gap-2 text-sm">
        <a href="?sort=date_desc" className="underline">Fecha ↓</a>
        <a href="?sort=date_asc" className="underline">Fecha ↑</a>
        <a href="?sort=name_asc" className="underline">Nombre A-Z</a>
        <a href="?sort=name_desc" className="underline">Nombre Z-A</a>
      </div>
      <Table columns={columns as any} rows={data.rows} />
      <Pagination page={data.meta.page} pages={data.meta.pages} />
    </div>
  );
}

