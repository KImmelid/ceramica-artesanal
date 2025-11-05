"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

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
      alert(res?.error || "Credenciales inválidas");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-card">
        <h1 className="text-2xl font-serif mb-4 text-center">Iniciar sesión</h1>
        <div className="space-y-4">
          <input name="email" type="email" placeholder="Correo electrónico" className="w-full px-3 py-2 border rounded-lg" required />
          <input name="password" type="password" placeholder="Contraseña" className="w-full px-3 py-2 border rounded-lg" required />
          <button disabled={loading} className="w-full px-3 py-2 rounded-lg text-white" style={{ background: "#C4623E" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <p className="text-sm text-center text-neutral-600 mt-3">
          ¿No tienes cuenta? <a href="/registro" className="text-terracotta underline">Regístrate</a>
        </p>
      </form>
    </main>
  );
}

