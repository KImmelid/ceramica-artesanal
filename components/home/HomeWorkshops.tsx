import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";
import InscribirButton from "@/app/usuario/talleres/InscribirButton";
import CancelarButton from "@/app/usuario/talleres/CancelarButton";

export const runtime = "nodejs";

const formatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function HomeWorkshops() {
  const session = await getServerSession(authConfig);
  const talleres = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    take: 4,
    include: { _count: { select: { enrollments: true } } },
  });

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const inscritos = new Set<number>(
    userId
      ? (await prisma.workshopEnrollment.findMany({
          where: { userId },
          select: { workshopId: true },
        })).map((e) => e.workshopId)
      : []
  );

  if (talleres.length === 0) {
    return (
      <div className="rounded-2xl border p-6 bg-white text-neutral-600">
        Aun no hay talleres programados. Vuelve pronto o
        <a className="underline ml-1" href="/talleres">explora talleres</a>.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {talleres.map((t) => {
        const ahora = Date.now();
        const fecha = new Date(t.date);
        const disponibles = Number(t.capacity) - Number(t._count?.enrollments || 0);
        const quedan = Math.max(0, disponibles);
        const preWindowMs = 2 * 60 * 60 * 1000;
        const ts = fecha.getTime();
        const soon = ts > ahora && ts - ahora <= preWindowMs;
        const abierta = (t.open ?? true) && quedan > 0 && ts > ahora && ts - ahora > preWindowMs;
        const yaInscrito = inscritos.has(t.id);

        return (
          <article key={t.id} className="card flex flex-col gap-4">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500 tracking-[0.2em]">Taller</p>
                <h3 className="font-serif text-xl mt-1">{t.title}</h3>
                {t.description ? (
                  <p className="text-sm text-neutral-600 mt-1">{t.description}</p>
                ) : null}
              </div>
              <span className="badge badge-success whitespace-nowrap">
                Cupos {quedan}/{t.capacity}
              </span>
            </header>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 11h18" />
                </svg>
                {formatter.format(fecha)}
              </span>
              {soon && <span className="badge badge-warning">Cierra pronto</span>}
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              {session && yaInscrito ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-700">Ya estas inscripto</span>
                  <CancelarButton id={t.id} />
                </div>
              ) : abierta ? (
                session ? (
                  <InscribirButton id={t.id} />
                ) : (
                  <a className="btn btn-primary" href="/login?callbackUrl=/usuario/talleres">
                    Iniciar sesion para inscribirme
                  </a>
                )
              ) : (
                <button className="btn btn-primary opacity-50 cursor-not-allowed" disabled>
                  {quedan <= 0 ? "Sin cupos" : "Cerrado"}
                </button>
              )}
              <a className="btn btn-outline" href="/talleres">Ver mas</a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
