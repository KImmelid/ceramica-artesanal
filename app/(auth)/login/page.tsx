export default function LoginPage() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-card">
          <h1 className="text-2xl font-serif mb-4 text-center">Iniciar sesión</h1>
          <form className="space-y-4">
            <input type="email" placeholder="Correo electrónico" className="w-full px-3 py-2 border rounded-lg" />
            <input type="password" placeholder="Contraseña" className="w-full px-3 py-2 border rounded-lg" />
            <button className="w-full px-3 py-2 rounded-lg text-white" style={{ background: "#C4623E" }}>
              Entrar
            </button>
          </form>
          <p className="text-sm text-center text-neutral-600 mt-3">
            ¿No tienes cuenta? <a href="/registro" className="text-terracotta underline">Regístrate</a>
          </p>
        </div>
      </main>
    );
  }
  