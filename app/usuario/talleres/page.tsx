import { prisma } from "@/lib/db";
import CancelarButton from "@/app/usuario/talleres/CancelarButton";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export default async function UsuarioTalleresPage() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const talleres = userId
    ? await prisma.workshopEnrollment.findMany({
        where: { userId },
        include: { workshop: true },
      })
    : [];

  return (
    <div>
      <h1 className="text-xl font-serif mb-4">Mis talleres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {talleres.length === 0 ? (
          <p className="text-gray-500">No estás inscrito en ningún taller.</p>
        ) : (
          talleres.map((t) => (
            <div key={t.id} className="rounded-2xl border bg-white p-4">
              <h2 className="font-medium">{t.workshop.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(t.workshop.date).toLocaleString()}
              </p>
              <p className="text-sm mt-2">{t.workshop.description}</p>
              <div className="mt-3">
                <CancelarButton id={t.workshopId} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
