"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

type AuthSheetContextValue = {
  open: (mode?: Mode) => void;
};

const AuthSheetContext = createContext<AuthSheetContextValue | null>(null);

export function useAuthSheet() {
  const ctx = useContext(AuthSheetContext);
  if (!ctx) {
    throw new Error("useAuthSheet must be used within AuthSheetProvider");
  }
  return ctx;
}

export default function AuthSheetProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("login");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const open = useCallback((nextMode: Mode = "login") => {
    setMode(nextMode);
    setVisible(true);
    setMessage(null);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setMessage(null);
  }, []);

  const handleLogin = useCallback(
    async (form: FormData) => {
      setLoading(true);
      setMessage(null);
      const res = await signIn("credentials", {
        redirect: false,
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      setLoading(false);
      if (res?.ok) {
        close();
        router.refresh();
      } else {
        setMessage(res?.error || "No pudimos iniciar sesion con esos datos.");
      }
    },
    [close, router]
  );

  const handleRegister = useCallback(
    async (form: FormData) => {
      setLoading(true);
      setMessage(null);
      const payload = {
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLoading(false);
      if (res.ok) {
        setMode("login");
        setMessage("Cuenta creada. Ahora inicia sesion.");
      } else {
        let error = "No pudimos crear la cuenta.";
        try {
          const data = await res.json();
          error = data?.error || error;
        } catch {
          // ignore
        }
        setMessage(error);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      if (mode === "login") {
        await handleLogin(form);
      } else {
        await handleRegister(form);
      }
    },
    [handleLogin, handleRegister, mode]
  );

  return (
    <AuthSheetContext.Provider value={{ open }}>
      {children}
      <div className={`auth-sheet ${visible ? "auth-sheet--open" : ""}`} aria-hidden={!visible}>
        <div className="auth-sheet__backdrop" onClick={close} />
        <div className="auth-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="auth-sheet-title">
          <button type="button" className="auth-sheet__close" onClick={close} aria-label="Cerrar panel de acceso">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
          <div className="auth-sheet__header">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" /> Acceso rapido
            </p>
            <h2 id="auth-sheet-title" className="text-2xl font-serif">
              {mode === "login" ? "Inicia sesion" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-neutral-500">
              Gestiona pedidos, talleres y piezas guardadas desde un solo espacio.
            </p>
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
                onClick={() => setMode("login")}
              >
                Ya tengo cuenta
              </button>
              <button
                type="button"
                className={`auth-tab ${mode === "register" ? "auth-tab--active" : ""}`}
                onClick={() => setMode("register")}
              >
                Soy nuevo
              </button>
            </div>
          </div>

          <form className="auth-sheet__form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="sr-only" htmlFor="auth-name">Nombre completo</label>
                <input id="auth-name" name="name" placeholder="Nombre completo" className="input w-full" required />
              </div>
            )}
            <div>
              <label className="sr-only" htmlFor="auth-email">Correo electronico</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                placeholder="Correo electronico"
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="auth-password">Contrasena</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                placeholder="Contrasena"
                className="input w-full"
                required
              />
            </div>
            {message && <p className="text-sm text-terracotta">{message}</p>}
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
            {mode === "login" ? (
              <p className="text-xs text-neutral-500 text-center">
                No tienes cuenta?{" "}
                <button type="button" className="underline text-neutral-800" onClick={() => setMode("register")}>
                  Registrate
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-500 text-center">
                Ya sos parte?{" "}
                <button type="button" className="underline text-neutral-800" onClick={() => setMode("login")}>
                  Inicia sesion
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </AuthSheetContext.Provider>
  );
}
