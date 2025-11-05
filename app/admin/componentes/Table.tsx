"use client";
import React from "react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
};

export default function Table<T>({ columns, rows, loading, emptyText = "Sin datos" }: Props<T>) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-4 py-3 text-gray-500" colSpan={columns.length}>Cargando...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td className="px-4 py-3 text-gray-500" colSpan={columns.length}>{emptyText}</td></tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-t">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-2">
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
