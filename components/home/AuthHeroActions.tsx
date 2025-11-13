"use client";

import { useAuthSheet } from "@/components/auth/AuthSheetProvider";

export default function AuthHeroActions() {
  const { open } = useAuthSheet();
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white text-neutral-800 hover:bg-neutral-50"
        onClick={() => open("login")}
      >
        Iniciar sesion
        <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
        onClick={() => open("register")}
      >
        Crear cuenta
      </button>
      <span className="text-xs text-neutral-500">Acceso directo sin salir de la pagina</span>
    </div>
  );
}
