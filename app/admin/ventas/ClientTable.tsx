"use client";
import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table, { type Column } from "../componentes/Table";

export type SaleRow = {
  id: number;
  total: number;
  createdAt: string | Date;
  user: { name: string | null } | null;
};

type Props = { rows: SaleRow[]; page: number; pages: number };

export default function ClientTable({ rows, page, pages }: Props) {
  const columns: Column<SaleRow>[] = [
    { key: "id", header: "#" },
    { key: "user", header: "Cliente", render: (v) => v.user?.name ?? "N/A" },
    { key: "total", header: "Monto", render: (v) => `$${v.total}` },
    { key: "createdAt", header: "Fecha", render: (v) => new Date(v.createdAt).toLocaleString() },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-serif">Ventas</h1>
      <FiltersBar placeholders={{ q: "Buscar por # o cliente" }} />
      <Table columns={columns} rows={rows} />
      <Pagination page={page} pages={pages} />
    </div>
  );
}
