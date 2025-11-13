"use client";
import FiltersBar from "../componentes/FiltersBar";
import Pagination from "../componentes/Pagination";
import Table, { type Column } from "../componentes/Table";
import AdminProductActions from "./AdminProductActions";

export type ProductRow = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  createdAt: string | Date;
};

type Props = { rows: ProductRow[]; page: number; pages: number };

export default function ClientTable({ rows, page, pages }: Props) {
  const columns: Column<ProductRow>[] = [
    { key: "name", header: "Nombre" },
    { key: "price", header: "Precio", render: (p) => `$${p.price}` },
    { key: "stock", header: "Stock" },
    { key: "createdAt", header: "Creado", render: (p) => new Date(p.createdAt).toLocaleDateString() },
    { key: "actions", header: "Acciones", render: (p) => <AdminProductActions product={p} /> },
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
      <Table columns={columns} rows={rows} />
      <Pagination page={page} pages={pages} />
    </div>
  );
}
