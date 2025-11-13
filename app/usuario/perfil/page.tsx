import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";
import CancelarButton from "@/app/usuario/talleres/CancelarButton";

const formatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function UsuarioPerfilPage() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const talleres = userId
    ? await prisma.workshopEnrollment.findMany({
        where: { userId },
        include: { workshop: true },
        orderBy: { id: "desc" },
      })
    : [];

  return (
    <div className="section container space-y-10">
      <header className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border bg-white/90 p-8 space-y-4" style={{ borderColor: "rgba(222, 214, 206, 0.7)" }}>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Perfil
          </p>
          <h1 className="text-3xl font-serif">Hola {session?.user?.name ?? "visitante"}</h1>
          <p className="rich-text">
            Desde este espacio podras seguir tus talleres, revisar pedidos y mantener tus datos actualizados.
          </p>
          <dl className="grid gap-3 text-sm text-neutral-600">
            <div>
              <dt className="uppercase tracking-wide text-xs text-neutral-500">Correo</dt>
              <dd className="text-neutral-900">{session?.user?.email ?? "sin correo"}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide text-xs text-neutral-500">Rol</dt>
              <dd className="inline-flex px-3 py-1 rounded-full border text-xs font-medium" style={{ borderColor: "rgba(222,214,206,0.8)" }}>
                {session?.user?.role ?? "USER"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="panel-muted">
          <p className="font-serif text-xl">Pro tip</p>
          <p className="text-sm text-neutral-600 mt-2">
            Si necesitas reagendar un taller, cancelalo aqui mismo con 12 horas de anticipacion y liberaremos el cupo.
          </p>
          <a href="/talleres" className="btn btn-outline mt-4 self-start">Ver todos los talleres</a>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif">Mis talleres</h2>
          <span className="text-sm text-neutral-500">{talleres.length} activos</span>
        </div>
        {talleres.length === 0 ? (
          <div className="panel-muted text-neutral-600">
            Aun no estas inscripto en talleres. Explora nuevas fechas en la pagina de talleres.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {talleres.map((item) => (
              <article key={item.id} className="card flex flex-col gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Taller</p>
                  <h3 className="text-lg font-semibold">{item.workshop.title}</h3>
                </div>
                <p className="text-sm text-neutral-600">{formatter.format(new Date(item.workshop.date))}</p>
                {item.workshop.description ? (
                  <p className="text-sm text-neutral-600">{item.workshop.description}</p>
                ) : null}
                <div className="mt-auto">
                  <CancelarButton id={item.workshopId} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
