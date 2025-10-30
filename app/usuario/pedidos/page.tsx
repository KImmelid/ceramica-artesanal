import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export default async function UsuarioPedidosPage() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const pedidos = userId
    ? await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h1 className="text-xl font-serif mb-4">Mis pedidos</h1>
      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="text-left px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td className="px-4 py-3 text-gray-500" colSpan={4}>
                  No tienes pedidos registrados.
                </td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">${p.total}</td>
                  <td className="px-4 py-2">{p.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

