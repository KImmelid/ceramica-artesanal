"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type Option = { value: string; label: string };

type ControlledProps = {
  q?: string;
  onQChange?: (v: string) => void;
  sort?: string;
  onSortChange?: (v: string) => void;
  sortOptions?: Option[];
  perPage?: number;
  onPerPageChange?: (n: number) => void;
  showDate?: boolean;
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (v: string) => void;
  onDateToChange?: (v: string) => void;
};

type UrlModeProps = {
  placeholders?: { q?: string };
};

type Props = ControlledProps & UrlModeProps;

export default function FiltersBar(props: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const controlled = useMemo(() =>
    props.onQChange || props.onSortChange || props.onPerPageChange || props.showDate,
  [props.onQChange, props.onSortChange, props.onPerPageChange, props.showDate]);

  const [qLocal, setQLocal] = useState(props.q ?? "");
  useEffect(() => { if (controlled) setQLocal(props.q ?? ""); }, [controlled, props.q]);
  useEffect(() => { if (!controlled) setQLocal(sp.get("q") || ""); }, [controlled, sp]);

  function applyUrl() {
    const url = new URL(window.location.href);
    if (qLocal) url.searchParams.set("q", qLocal); else url.searchParams.delete("q");
    url.searchParams.set("page", "1");
    router.push(url.pathname + "?" + url.searchParams.toString());
  }

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <div className="flex-1 min-w-[220px]">
        <label className="block text-xs text-gray-600 mb-1">Buscar</label>
        <input
          value={controlled ? (props.q ?? "") : qLocal}
          onChange={(e) => controlled ? props.onQChange?.(e.target.value) : setQLocal(e.target.value)}
          placeholder={props.placeholders?.q || "Buscar..."}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {props.sortOptions && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">Ordenar</label>
          <select
            value={props.sort || ""}
            onChange={(e) => props.onSortChange?.(e.target.value)}
            className="border rounded-md px-2 py-2 text-sm min-w-[180px]"
          >
            {props.sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {props.onPerPageChange && typeof props.perPage === "number" && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">Por página</label>
          <select
            value={String(props.perPage)}
            onChange={(e) => props.onPerPageChange?.(Number(e.target.value))}
            className="border rounded-md px-2 py-2 text-sm"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      {props.showDate && (
        <>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={props.dateFrom || ""}
              onChange={(e) => props.onDateFromChange?.(e.target.value)}
              className="border rounded-md px-2 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={props.dateTo || ""}
              onChange={(e) => props.onDateToChange?.(e.target.value)}
              className="border rounded-md px-2 py-2 text-sm"
            />
          </div>
        </>
      )}

      {!controlled && (
        <>
          <button onClick={applyUrl} className="rounded bg-[#C4623E] text-white px-3 py-2 text-sm">Aplicar</button>
          <button onClick={() => { setQLocal(""); router.push(window.location.pathname); }} className="text-sm underline">Limpiar</button>
        </>
      )}
    </div>
  );
}
