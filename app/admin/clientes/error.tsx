"use client";
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-md border p-4 bg-red-50 text-red-700 text-sm space-y-2">
      <p>Ocurrió un error al cargar clientes.</p>
      <button onClick={reset} className="underline">Reintentar</button>
    </div>
  );
}
