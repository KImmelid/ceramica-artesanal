import { prisma } from "@/lib/db";

export default async function AdminTalleresPage() {
  const talleres = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-serif">Talleres</h1>
        <button className="px-3 py-2 rounded-lg bg-[#C4623E] text-white text-sm">
          + Nuevo taller
        </button>
      </div>
      <div className="rounded-2xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Título</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="text-left px-4 py-2">Cupo</th>
            </tr>
          </thead>
          <tbody>
            {talleres.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">
                  {new Date(t.date).toLocaleString()}
                </td>
                <td className="px-4 py-2">{t.capacity}</td>
              </tr>
            ))}
            {talleres.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-gray-500">
                  No hay talleres creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

