"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title = "Confirmar", message, confirmLabel = "Aceptar", cancelLabel = "Cancelar", onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white border shadow p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="text-sm text-gray-600 mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-3 py-1.5 rounded text-white" style={{ background: "#C4623E" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

