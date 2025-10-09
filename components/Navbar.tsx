export default function Navbar() {
    return (
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "#E4E4E7" }}>
        <div className="mx-auto max-w-[1280px] px-4 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full grid place-items-center text-white"
              style={{ background: "#C4623E" }}
            >
              CA
            </div>
            <span className="font-serif text-xl">Cerámica Artesanal</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#coleccion" className="hover:underline">Colección</a>
            <a href="#talleres" className="hover:underline">Talleres</a>
            <a href="#nosotros" className="hover:underline">Nosotros</a>
            <a href="#contacto" className="hover:underline">Contacto</a>
          </nav>
        </div>
      </header>
    );
  }
  