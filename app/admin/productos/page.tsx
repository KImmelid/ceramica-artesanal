import { prisma } from "@/lib/db";

export default async function AdminProductosPage() {
  const productos = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-serif">Productos</h1>
        <button className="px-3 py-2 rounded-lg bg-[#C4623E] text-white text-sm">
          + Nuevo producto
        </button>
      </div>
      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Precio</th>
              <th className="text-left px-4 py-2">Stock</th>
              <th className="text-left px-4 py-2">Creado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

