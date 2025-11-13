"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelarButton({ id }: { id: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function cancelar() {
    if (!confirm("¿Cancelar tu inscripción a este taller?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/talleres/${id}/inscribir`, { method: "DELETE" });
      if (res.ok) {
        setMsg("Inscripción cancelada.");
        router.refresh();
      } else {
        const { error } = await res.json().catch(() => ({ error: "Ocurrió un error." }));
        setMsg(error || "Ocurrió un error.");
      }
    } catch {
      setMsg("Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={cancelar}
        disabled={loading}
        className="text-sm underline text-red-600 disabled:opacity-50"
      >
        Cancelar inscripción
      </button>
      {msg && <span className="text-sm text-gray-600">{msg}</span>}
    </div>
  );
}

