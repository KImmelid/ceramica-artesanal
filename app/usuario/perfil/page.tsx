import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export default async function UsuarioPerfilPage() {
  const session = await getServerSession(authConfig);

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-xl font-serif">Mi perfil</h1>
      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div>
          <label className="text-sm text-gray-500">Nombre</label>
          <p className="text-base">{session?.user?.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Correo</label>
          <p className="text-base">{session?.user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Rol</label>
          <p className="inline-flex px-2 py-1 bg-gray-100 rounded-lg text-xs">
            {(session?.user as any)?.role ?? "USER"}
          </p>
        </div>
      </div>
    </div>
  );
}
