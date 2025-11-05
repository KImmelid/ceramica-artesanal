import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table from "../componentes/Table";

type SearchParams = { [k: string]: string | string[] | undefined };

async function fetchVentas(searchParams: SearchParams) {
  const sp = new URLSearchParams();
  ["q", "sort", "page", "perPage", "dateFrom", "dateTo"].forEach((k) => {
    const v = searchParams[k];
    if (typeof v === "string") sp.set(k, v);
  });
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/ventas?${sp.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar ventas");
  return res.json() as Promise<{ meta: { page: number; pages: number }; rows: any[] }>;
}

export default async function VentasPage({ searchParams }: { searchParams: SearchParams }) {
  const data = await fetchVentas(searchParams);
  const columns = [
    { key: "id", header: "#" },
    { key: "cliente", header: "Cliente", render: (v: any) => v.user?.name ?? "N/A" },
    { key: "total", header: "Monto", render: (v: any) => `$${v.total}` },
    { key: "fecha", header: "Fecha", render: (v: any) => new Date(v.createdAt).toLocaleString() },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-serif">Ventas</h1>
      <FiltersBar placeholders={{ q: "Buscar por # o cliente" }} />
      <Table columns={columns as any} rows={data.rows} />
      <Pagination page={data.meta.page} pages={data.meta.pages} />
    </div>
  );
}
