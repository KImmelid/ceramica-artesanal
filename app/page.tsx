import { Suspense } from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductList, { type ProductListItem } from "@/components/ProductList";
import HomeWorkshops from "@/components/home/HomeWorkshops";
import WorkshopsSkeleton from "@/components/home/WorkshopsSkeleton";
import AuthHeroActions from "@/components/home/AuthHeroActions";
import HeroGallery from "@/components/home/HeroGallery";

const highlights = [
  { title: "Texturas organicas", description: "Acabados satinados y mate logrados con esmaltes propios." },
  { title: "Ediciones pequenas", description: "Series de 12 a 24 piezas numeradas y firmadas a mano." },
  { title: "Arcillas locales", description: "Trabajamos con barros de Catamarca, Cordoba y La Rioja." },
];

const values = [
  { title: "Taller familiar", detail: "Mas de 15 anos entre hornos, tornos y esmaltes." },
  { title: "Diseno consciente", detail: "Elegimos procesos lentos y proveedores proximos." },
  { title: "Espacio abierto", detail: "Compartimos saberes en talleres semanales y residencias." },
];

export default async function Page() {
  const featuredProducts: ProductListItem[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, name: true, price: true, stock: true, image: true },
  });

  return (
    <>
      {/* Hero */}
      <section className="section container grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Coleccion otono 2025
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">
              Ceramica con alma, pensada para mesas cotidianas y rituales lentos.
            </h1>
            <p className="rich-text">
              Piezas modeladas a mano en pequenos lotes. Cada curva, esmalte y textura conserva
              la huella del taller, celebrando la tierra y el oficio.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#coleccion" className="btn btn-primary">Explorar coleccion</a>
            <a href="/talleres" className="btn btn-outline">Proximos talleres</a>
          </div>
          <AuthHeroActions />
          <div className="flex flex-wrap gap-6 pt-4">
            <div>
              <p className="font-serif text-3xl">120+</p>
              <p className="text-sm text-neutral-600">piezas unicas en stock</p>
            </div>
            <div>
              <p className="font-serif text-3xl">4</p>
              <p className="text-sm text-neutral-600">talleres activos este mes</p>
            </div>
            <div>
              <p className="font-serif text-3xl">15</p>
              <p className="text-sm text-neutral-600">anos perfeccionando tecnicas</p>
            </div>
          </div>
        </div>
        <HeroGallery />
      </section>

      {/* Coleccion */}
      <section id="coleccion" className="section container space-y-10">
        <header className="space-y-3 max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Piezas seleccionadas
          </p>
          <div>
            <h2 className="text-3xl font-serif">Nuestra coleccion</h2>
            <p className="rich-text mt-3">
              Curamos objetos cotidianos con caracter. Combina piezas esmaltadas a pincel con arcillas
              naturales para mesas calidas y contemporaneas.
            </p>
          </div>
        </header>
        <div
          className="rounded-3xl border bg-white/90 p-8 shadow-[0_25px_60px_rgba(20,17,15,0.08)]"
          style={{ borderColor: "rgba(222, 214, 206, 0.7)" }}
        >
          <ProductList products={featuredProducts} />
          <div className="mt-8 flex flex-col gap-3 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
            <p>Envios a todo el pais y retiro en el taller cada viernes.</p>
            <a href="/tienda" className="inline-flex items-center gap-2 font-medium text-neutral-900">
              Ver todos los productos
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
        <div className="features-grid md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="feature-card">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-neutral-600 mt-2">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Talleres */}
      <section id="talleres" className="section container space-y-8">
        <div className="grid gap-6 md:grid-cols-[0.9fr,1.1fr] md:items-end">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" /> Comunidad del barro
            </p>
            <h2 className="text-3xl font-serif mt-3">Talleres y residencias</h2>
            <p className="rich-text mt-3">
              Sesiones intimas de maximo 10 personas. Compartimos tecnicas de modelado, torno, esmaltes
              y quemas experimentales. Trae tus ideas, nosotros guiamos el proceso.
            </p>
          </div>
          <p className="panel-muted text-sm text-neutral-600">
            Todos los talleres incluyen materiales, horneadas y bitacora ilustrada con ejercicios.
            Si ya participaste, accedes a una residencia abierta mensual para continuar tus proyectos.
          </p>
        </div>
        <Suspense fallback={<WorkshopsSkeleton />}>
          <HomeWorkshopsWrapper />
        </Suspense>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="section container grid gap-10 lg:grid-cols-[1.1fr,.9fr]">
        <div
          className="rounded-3xl border bg-white/90 p-8"
          style={{ borderColor: "rgba(222, 214, 206, 0.75)" }}
        >
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Oficio vivo
          </p>
          <h2 className="text-3xl font-serif mt-4">Sobre nuestro taller</h2>
          <p className="rich-text mt-4">
            Somos un equipo familiar que une tecnicas tradicionales del noroeste argentino con una mirada
            contemporanea. Cada pieza pasa por cuatro manos antes de llegar a tu mesa.
          </p>
          <div className="mt-6 grid gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col rounded-2xl border bg-white px-4 py-3"
                style={{ borderColor: "rgba(222, 214, 206, 0.6)" }}
              >
                <p className="font-semibold">{value.title}</p>
                <p className="text-sm text-neutral-600">{value.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div
            className="relative h-64 rounded-3xl border overflow-hidden"
            style={{ borderColor: "rgba(222, 214, 206, 0.6)" }}
          >
            <Image
              src="/images/nosotros/nosotros.png"
              alt="Detalle del taller y piezas recien esmaltadas"
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="panel-muted">
            <p className="font-serif text-xl">Cada coleccion nace de caminar el monte y escuchar lo que la tierra pide ser.</p>
            <p className="text-sm text-neutral-500 mt-3">- Sofia Paredes, fundadora</p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="section container space-y-6">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Agenda abierta
          </p>
          <h2 className="text-3xl font-serif mt-3">Hablemos</h2>
          <p className="rich-text mt-3">
            Coordina una visita al taller, consultas sobre piezas a medida o propuestas para talleres corporativos.
          </p>
        </div>
        <div className="contact-card md:grid-cols-[1fr,1.2fr]">
          <div className="contact-details">
            <div>
              <p className="text-neutral-500 text-xs uppercase">Horario</p>
              <p>Martes a sabado | 10 a 18 h</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs uppercase">Direccion</p>
              <p>Pasaje del Barro 147, Barrio Guemes, Cordoba</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs uppercase">Contacto</p>
              <p>+54 9 351 555-0101</p>
              <p>hola@ceramicaartesanal.studio</p>
            </div>
            <p className="text-sm text-neutral-500">
              Respondemos en menos de 24 hs. Si sos interior, coordinamos videollamada.
            </p>
          </div>
          <form className="grid gap-4">
            <label className="sr-only" htmlFor="contact-name">Nombre</label>
            <input id="contact-name" aria-label="Nombre" placeholder="Nombre" className="input" />
            <label className="sr-only" htmlFor="contact-email">Email</label>
            <input id="contact-email" aria-label="Email" placeholder="Email" className="input" type="email" />
            <label className="sr-only" htmlFor="contact-message">Mensaje</label>
            <textarea id="contact-message" aria-label="Mensaje" placeholder="Mensaje" className="input h-32" />
            <button className="btn btn-primary w-full" type="submit">Enviar consulta</button>
          </form>
        </div>
      </section>
    </>
  );
}

function HomeWorkshopsWrapper() {
  return <HomeWorkshops />;
}
