import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";
import InscribirButton from "@/app/usuario/talleres/InscribirButton";
import CancelarButton from "@/app/usuario/talleres/CancelarButton";
import { Prisma } from "@prisma/client";
import Link from "next/link";

export const runtime = "nodejs";

type WorkshopWithCount = Prisma.WorkshopGetPayload<{ include: { _count: { select: { enrollments: true } } } }>;

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function TalleresPublicPage() {
  const session = await getServerSession(authConfig);
  const talleres = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
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

  return (
    <div className="section container space-y-10">
      <header className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-4">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Agenda viva
          </p>
          <h1 className="text-4xl font-serif leading-tight">Talleres y residencias abiertas</h1>
          <p className="rich-text">
            Sesiones pequenas, materiales incluidos y acompanamiento cercano para que explores el barro desde cero
            o profundices tus tecnicas.
          </p>
        </div>
        <div className="panel-muted text-sm text-neutral-600">
          <p>Todos los talleres incluyen materiales, horneadas y bitacora ilustrada. Cupos limitados a 10 personas.</p>
          {!session && (
            <p className="mt-2">
              Crea tu cuenta o inicia sesion desde la esquina superior para reservar tu lugar sin salir de esta pagina.
            </p>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {talleres.length === 0 ? (
          <div className="panel-muted text-neutral-600">
            Aun no hay talleres programados. Suscribite al boletin para enterarte antes de las nuevas fechas.
          </div>
        ) : (
          talleres.map((t) => (
            <WorkshopCard
              key={t.id}
              data={t}
              isLogged={Boolean(session)}
              yaInscrito={inscritos.has(t.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function WorkshopCard({
  data,
  isLogged,
  yaInscrito,
}: {
  data: WorkshopWithCount;
  isLogged: boolean;
  yaInscrito: boolean;
}) {
  const cupos = Math.max(0, Number(data.capacity) - Number(data._count?.enrollments ?? 0));
  const fecha = new Date(data.date);
  const ahora = Date.now();
  const ts = fecha.getTime();
  const preWindowMs = 2 * 60 * 60 * 1000;
  const pronto = ts > ahora && ts - ahora <= preWindowMs;
  const abierto = (data.open ?? true) && cupos > 0 && ts > ahora && ts - ahora > preWindowMs;

  return (
    <article className="card flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Taller</p>
        <h3 className="text-xl font-serif">{data.title}</h3>
        {data.description ? (
          <p className="text-sm text-neutral-600 mt-1">{data.description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700">
        <span className="inline-flex items-center gap-2">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 11h18" />
          </svg>
          {dateFormatter.format(fecha)}
        </span>
        <span className="badge badge-success">Cupos {cupos}/{data.capacity}</span>
        {pronto && <span className="badge badge-warning">Cierra pronto</span>}
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        {isLogged && yaInscrito ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-green-700">Ya estas inscripto</span>
            <CancelarButton id={data.id} />
          </div>
        ) : abierto ? (
          isLogged ? (
            <InscribirButton id={data.id} />
          ) : (
            <a className="btn btn-primary" href="/login?callbackUrl=/talleres">
              Iniciar sesion para inscribirme
            </a>
          )
        ) : (
          <button className="btn btn-primary opacity-50 cursor-not-allowed" disabled>
            {cupos <= 0 ? "Sin cupos" : "Cerrado"}
          </button>
        )}
        <Link className="btn btn-outline" href="/#contacto">
          Consultar materiales
        </Link>
      </div>
    </article>
  );
}
