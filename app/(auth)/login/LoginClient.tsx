"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setMessage(res?.error || "Revisa el correo y la contrasena.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ef] flex items-center">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr_.9fr] items-center py-16">
        <div className="space-y-6">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Acceso al taller
          </p>
          <h1 className="text-4xl font-serif leading-tight">Bienvenido de vuelta</h1>
          <p className="rich-text max-w-xl">
            Gestiona tus pedidos, sigue tus talleres activos y guarda piezas favoritas desde tu espacio personal.
          </p>
          <div className="grid gap-4 text-sm text-neutral-600">
            <div className="feature-card">
              <p className="font-semibold text-neutral-900">Agenda sincronizada</p>
              <p>Recordatorios antes de cada taller y acceso rapido a materiales.</p>
            </div>
            <div className="feature-card">
              <p className="font-semibold text-neutral-900">Compras fluidas</p>
              <p>Historial de pedidos, direcciones guardadas y seguimiento de envios.</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="contact-card p-8">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-serif">Inicia sesion</h2>
            <p className="text-sm text-neutral-500">Ingresa tus datos para continuar.</p>
          </div>
          <div className="grid gap-4">
            <label className="sr-only" htmlFor="login-email">Correo electronico</label>
            <input id="login-email" aria-label="Correo electronico" name="email" type="email" placeholder="Correo electronico" className="input w-full" required />
            <label className="sr-only" htmlFor="login-password">Contrasena</label>
            <input id="login-password" aria-label="Contrasena" name="password" type="password" placeholder="Contrasena" className="input w-full" required />
            {message && <p className="text-sm text-terracotta">{message}</p>}
            <button disabled={loading} className="w-full btn btn-primary">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
          <p className="text-sm text-center text-neutral-600">
            No tenes cuenta? <a href="/registro" className="underline text-neutral-900">Registrate</a>
          </p>
        </form>
      </div>
    </main>
  );
}
