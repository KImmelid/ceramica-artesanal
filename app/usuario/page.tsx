import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export default async function UsuarioHome() {
  const session = await getServerSession(authConfig);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-serif">Hola, {session?.user?.name ?? "usuario"}</h1>
      <p className="text-gray-600">
        Desde aquí puedes ver tus pedidos, tus talleres y actualizar tu perfil.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Último pedido</p>
          <p className="text-xl font-semibold">#1243 · $180.000</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Próximo taller</p>
          <p className="text-xl font-semibold">Torno I — 12/Oct</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Nivel de cliente</p>
          <p className="text-xl font-semibold">Club Arcilla</p>
        </div>
      </div>
    </div>
  );
}
