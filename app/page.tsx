import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="section container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-serif mb-4">Cerámica con alma</h1>
          <p className="mb-6 text-neutral-600">
            Piezas únicas hechas a mano, inspiradas en la tierra y la tradición.
          </p>
          <a href="#coleccion" className="btn btn-primary">Explorar colección</a>
        </div>
        <div className="h-72 bg-neutral-100 rounded-xl" />
      </section>

      {/* Colección */}
      <section id="coleccion" className="section container">
        <h2 className="text-2xl font-serif mb-8">Nuestra colección</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Taza Andes", "Jarra Puna", "Plato Laguna", "Maceta Quebrada"].map((p) => (
            <article key={p} className="card">
              <div className="h-32 bg-neutral-100 mb-3 rounded-lg" />
              <h3 className="font-medium">{p}</h3>
              <p className="text-sm text-neutral-600">$45.000</p>
            </article>
          ))}
        </div>
      </section>

      {/* Talleres */}
      <section id="talleres" className="section container">
        <h2 className="text-2xl font-serif mb-8">Talleres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="card">
            <h3 className="font-medium mb-1">Torno I</h3>
            <p className="text-sm text-neutral-600">12/10 · Cupos 10/12</p>
            <button className="btn btn-primary mt-3">Inscribirse</button>
          </article>
          <article className="card">
            <h3 className="font-medium mb-1">Esmaltes básicos</h3>
            <p className="text-sm text-neutral-600">20/10 · Cupos 8/8</p>
            <button className="btn btn-outline mt-3">Lista de espera</button>
          </article>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="section container grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-60 bg-neutral-100 rounded-lg" />
        <div>
          <h2 className="text-2xl font-serif mb-4">Sobre nosotros</h2>
          <p className="text-neutral-600">
            Taller familiar que fusiona tradición y diseño contemporáneo. Cada pieza
            está hecha a mano con materiales de origen local.
          </p>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="section container">
        <h2 className="text-2xl font-serif mb-6">Contáctanos</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre" className="px-3 py-2 border rounded-lg" style={{ borderColor: "#E4E4E7" }} />
          <input placeholder="Email" className="px-3 py-2 border rounded-lg" style={{ borderColor: "#E4E4E7" }} />
          <textarea placeholder="Mensaje" className="md:col-span-2 px-3 py-2 border rounded-lg h-32" style={{ borderColor: "#E4E4E7" }} />
          <button className="md:col-span-2 btn btn-primary">Enviar</button>
        </form>
      </section>

      <Footer />
    </>
  );
}
