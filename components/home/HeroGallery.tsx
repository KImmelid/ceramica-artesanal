import Image from "next/image";

const photos = [
  {
    src: "/images/hero/hero-1.png",
    alt: "Mesa con piezas esmaltadas en tonos terracota",
  },
  {
    src: "/images/hero/hero-2.png",
    alt: "Detalle de tazas y cuencos con esmalte verde",
  },
  {
    src: "/images/hero/hero-3.png",
    alt: "Utensilios y cuencos con texturas de barro",
  },
];

export default function HeroGallery() {
  return (
    <div className="hero-grid">
      <div className="pill absolute top-6 right-6">
        <span className="pill-dot" aria-hidden="true" /> Hecho a mano
      </div>
      <div className="grid gap-4">
        <div className="relative h-56 rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,.6)" }}>
          <Image
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {photos.slice(1).map((photo) => (
            <div key={photo.src} className="relative h-40 rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,.6)" }}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 200px, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
