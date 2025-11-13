"use client";
import React from "react";

export type Column<T extends Record<string, unknown>> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
};

type Props<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
};

export default function Table<T extends Record<string, unknown>>({ columns, rows, loading, emptyText = "Sin datos" }: Props<T>) {
  return (
    <div className="rounded-3xl border bg-white/95 overflow-hidden shadow-[0_18px_50px_rgba(20,17,15,0.06)]">
      <table className="table text-sm">
        <thead className="bg-[#f7efe8] text-neutral-600">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left uppercase tracking-wide text-xs">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-4 py-4 text-neutral-500" colSpan={columns.length}>Cargando...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td className="px-4 py-4 text-neutral-500" colSpan={columns.length}>{emptyText}</td></tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-[#fff8f3] transition">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3" style={{ textAlign: c.align || "left" }}>
                    {c.render ? c.render(row) : (row as Record<string, React.ReactNode | string | number>)[c.key]}
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
