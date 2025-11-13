export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-sm text-neutral-600 py-6 mt-12">
      <div className="mx-auto max-w-[1280px] px-4 text-center">
        © {new Date().getFullYear()} Cerámica Artesanal — Hecho a mano ❤
      </div>
    </footer>
  );
}

