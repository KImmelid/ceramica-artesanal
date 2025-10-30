import { prisma } from "@/lib/db";

export default async function AdminVentasPage() {
  const ventas = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: true },
  });

  return (
    <div>
      <h1 className="text-xl font-serif mb-4">Ventas</h1>
      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Cliente</th>
              <th className="text-left px-4 py-2">Monto</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.id}</td>
                <td className="px-4 py-2">{v.user?.name ?? "N/A"}</td>
                <td className="px-4 py-2">${v.total}</td>
                <td className="px-4 py-2">
                  {new Date(v.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{v.status}</td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-gray-500">
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

