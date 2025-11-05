"use client";
import { useState } from "react";

export default function InscribirButton({ id }: { id: number }) {
  const [msg, setMsg] = useState("");

  async function inscribir() {
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: 0, status: "Inscripción taller", workshopId: id }),
      });
      if (res.ok) setMsg("Inscripción exitosa.");
      else setMsg("Ocurrió un error.");
    } catch {
      setMsg("Ocurrió un error.");
    }
  }

  return (
    <div>
      <button
        onClick={inscribir}
        className="bg-[#C4623E] text-white rounded px-3 py-2 text-sm"
      >
        Inscribirme
      </button>
      {msg && <p className="text-sm mt-1 text-gray-600">{msg}</p>}
    </div>
  );
}
