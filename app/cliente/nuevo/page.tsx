import type { Metadata } from "next";
import Link from "next/link";
import { NewServiceForm } from "@/components/NewServiceForm";
import { boliviaDate, toDatetimeLocalValue } from "@/lib/format";

export const metadata: Metadata = { title: "Solicitar servicio" };

export default function NuevoServicioPage() {
  const defaultWhen = toDatetimeLocalValue(boliviaDate(1, 9));
  const minWhen = toDatetimeLocalValue(new Date());
  const maxWhen = toDatetimeLocalValue(boliviaDate(365, 18));

  return (
    <div className="mx-auto max-w-2xl">
      <p>
        <Link href="/cliente" className="font-bold text-pine underline underline-offset-4">
          Volver a mis servicios
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl">Solicitar servicio</h1>
      <p className="mt-2 text-muted">
        Cuéntenos dónde y cuándo. Administración asignará el dúo y usted verá el estado aquí.
      </p>
      <div className="mt-6">
        <NewServiceForm defaultWhen={defaultWhen} minWhen={minWhen} maxWhen={maxWhen} />
      </div>
    </div>
  );
}
