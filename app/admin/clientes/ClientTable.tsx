"use client";
import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table, { type Column } from "../componentes/Table";

export type ClientRow = {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  createdAt: string | Date;
};

type Props = { rows: ClientRow[]; page: number; pages: number };

export default function ClientTable({ rows, page, pages }: Props) {
  const columns: Column<ClientRow>[] = [
    { key: "name", header: "Nombre", render: (c) => c.name ?? "N/A" },
    { key: "email", header: "Email", render: (c) => c.email ?? "N/A" },
    { key: "role", header: "Rol" },
    {
      key: "createdAt",
      header: "Registrado",
      render: (c) => new Date(c.createdAt).toLocaleDateString(),
    },
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
      <Table columns={columns} rows={rows} />
      <Pagination page={page} pages={pages} />
    </div>
  );
}
