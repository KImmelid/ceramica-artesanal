"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      alert("Cuenta creada. Ahora inicia sesión.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data?.error || "Error al registrar");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-card">
        <h1 className="text-2xl font-serif mb-4 text-center">Crear cuenta</h1>
        <div className="space-y-4">
          <input name="name" placeholder="Nombre completo" className="w-full px-3 py-2 border rounded-lg" required />
          <input type="email" name="email" placeholder="Correo electrónico" className="w-full px-3 py-2 border rounded-lg" required />
          <input type="password" name="password" placeholder="Contraseña" className="w-full px-3 py-2 border rounded-lg" required />
          <button disabled={loading} className="w-full px-3 py-2 rounded-lg text-white" style={{ background: "#C4623E" }}>
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </div>
        <p className="text-sm text-center text-neutral-600 mt-3">
          ¿Ya tienes cuenta? <a href="/login" className="text-terracotta underline">Inicia sesión</a>
        </p>
      </form>
    </main>
  );
}
