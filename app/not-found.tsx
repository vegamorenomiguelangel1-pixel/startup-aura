import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenido" className="mx-auto max-w-xl px-4 py-16">
      <p className="font-bold text-gold-deep">404</p>
      <h1 className="mt-2 font-display text-4xl">No encontramos esa página</h1>
      <p className="mt-3 text-muted">El enlace puede estar mal o el servicio ya no está disponible para su cuenta.</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-pine px-5 font-bold text-white"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
