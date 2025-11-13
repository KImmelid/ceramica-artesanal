"use client";
import { useRouter } from "next/navigation";

type Props = {
  page: number;
  pages?: number;
  perPage?: number;
  total?: number;
  onPageChange?: (p: number) => void;
};

export default function Pagination({ page, pages, perPage, total, onPageChange }: Props) {
  const router = useRouter();

  const totalPages = pages && pages > 0
    ? Math.max(1, pages)
    : (perPage && total ? Math.max(1, Math.ceil(total / perPage)) : 1);
  const current = Math.min(Math.max(1, page), totalPages);

  function go(to: number) {
    const url = new URL(window.location.href);
    const next = Math.min(Math.max(1, to), totalPages);
    url.searchParams.set("page", String(next));
    if (onPageChange) onPageChange(next);
    else router.push(url.pathname + "?" + url.searchParams.toString());
  }

  return (
    <div className="flex flex-wrap items-center justify-between text-sm px-4 py-3 rounded-2xl border bg-white/90">
      <span>Pagina {current} de {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={current <= 1} onClick={() => go(current - 1)} className="btn btn-outline px-3 py-1 disabled:opacity-40">
          Anterior
        </button>
        <button disabled={current >= totalPages} onClick={() => go(current + 1)} className="btn btn-outline px-3 py-1 disabled:opacity-40">
          Siguiente
        </button>
      </div>
    </div>
  );
}
