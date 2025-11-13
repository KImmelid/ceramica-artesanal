"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
      setMessage("Cuenta creada. Ya podes iniciar sesion.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      const data = await res.json().catch(() => null);
      setMessage(data?.error || "No pudimos crear la cuenta.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ef] flex items-center">
      <div className="container grid gap-10 lg:grid-cols-[1.05fr_.95fr] items-center py-16">
        <form onSubmit={onSubmit} className="contact-card p-8 order-2 lg:order-1">
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-serif">Crear cuenta</h1>
            <p className="text-sm text-neutral-500">Completa los datos y sumate a la comunidad.</p>
          </div>
          <div className="grid gap-4">
            <label className="sr-only" htmlFor="reg-name">Nombre completo</label>
            <input id="reg-name" aria-label="Nombre completo" name="name" placeholder="Nombre completo" className="w-full input" required />
            <label className="sr-only" htmlFor="reg-email">Correo electronico</label>
            <input id="reg-email" aria-label="Correo electronico" type="email" name="email" placeholder="Correo electronico" className="w-full input" required />
            <label className="sr-only" htmlFor="reg-password">Contrasena</label>
            <input id="reg-password" aria-label="Contrasena" type="password" name="password" placeholder="Contrasena" className="w-full input" required />
            {message && <p className="text-sm text-terracotta text-center">{message}</p>}
            <button disabled={loading} className="w-full btn btn-primary">
              {loading ? "Creando..." : "Registrarme"}
            </button>
          </div>
          <p className="text-sm text-center text-neutral-600 mt-3">
            Ya tenes cuenta? <a href="/login" className="text-neutral-900 underline">Inicia sesion</a>
          </p>
        </form>

        <div className="space-y-6 order-1 lg:order-2">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Beneficios
          </p>
          <h2 className="text-4xl font-serif leading-tight">Disfruta una experiencia personalizada</h2>
          <ul className="grid gap-4 text-sm text-neutral-600">
            {[
              "Prioridad en nuevas hornadas y piezas unicas.",
              "Cupos reservados para talleres y residencias.",
              "Bitacora digital con avances y ejercicios.",
            ].map((item) => (
              <li key={item} className="feature-card">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
