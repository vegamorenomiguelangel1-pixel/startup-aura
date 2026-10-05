import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="contenido" className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-4 py-16">
      <p className="font-bold text-teal">404</p>
      <h1 className="mt-2 font-display text-4xl">No encontramos esa página</h1>
      <p className="mt-3 text-muted">Puede que el servicio no exista o que no tengas permiso para verlo.</p>
      <Link href="/" className={`${buttonClass("primary")} mt-6 self-start`}>
        Volver al inicio
      </Link>
    </main>
  );
}
