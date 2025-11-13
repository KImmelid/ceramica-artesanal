"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InscribirButton({ id }: { id: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function inscribir() {
    setLoading(true);
    try {
      const res = await fetch(`/api/talleres/${id}/inscribir`, { method: "POST" });
      if (res.ok) {
        setMsg("Inscripción exitosa.");
        router.push("/usuario/talleres");
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
    <div>
      <button
        onClick={inscribir}
        disabled={loading}
        className="bg-[#C4623E] text-white rounded px-3 py-2 text-sm disabled:opacity-50"
      >
        Inscribirme
      </button>
      {msg && <p className="text-sm mt-1 text-gray-600">{msg}</p>}
    </div>
  );
}

