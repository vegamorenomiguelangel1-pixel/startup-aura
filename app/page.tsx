import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { homeForRole } from "@/lib/labels";
import { OFFER } from "@/lib/offer";

const steps = [
  {
    title: "El cliente solicita",
    text: "Indica dirección, fecha y hora. El precio del dúo es fijo.",
  },
  {
    title: "Administración asigna",
    text: "Un integrante y un compañero de apoyo quedan a cargo del servicio.",
  },
  {
    title: "El dúo actualiza",
    text: "En camino, en progreso y completado, desde el celular.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5">
        <Logo />
        <a href="#ingresar" className="inline-flex min-h-11 items-center font-bold text-pine underline underline-offset-4">
          Ingresar
        </a>
      </header>
      <main id="contenido" className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section>
            <p className="font-bold text-gold-deep">{OFFER.city}</p>
            <h1 className="mt-2 font-display text-5xl leading-[1.15] text-balance sm:text-6xl">
              {OFFER.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg">
              {OFFER.name}: una persona con discapacidad o su tutor trabaja junto a un compañero de
              apoyo. Limpieza en {OFFER.durationLabel} por {formatPrice(OFFER.priceBs)}.
            </p>
            {user ? (
              <p className="mt-6">
                <Link
                  href={homeForRole(user.role)}
                  className="inline-flex min-h-12 items-center rounded-full bg-pine px-5 font-bold text-white"
                >
                  Ir a mi panel
                </Link>
              </p>
            ) : null}
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              <Fact term="Duración" detail={OFFER.durationLabel} />
              <Fact term="Precio" detail={formatPrice(OFFER.priceBs)} />
              <Fact term="Equipo" detail="Dúo inclusivo" />
            </dl>
          </section>
          <aside id="ingresar" className="lg:sticky lg:top-6">
            <LoginForm />
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="como-funciona">
          <h2 id="como-funciona" className="font-display text-3xl">
            Cómo se gestiona un servicio
          </h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-card p-4">
                <p className="font-display text-3xl text-pine">{index + 1}</p>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-sm text-muted">
          <p>
            {OFFER.city} ·{" "}
            <a className="underline" href={OFFER.site}>
              auraservicio.com
            </a>
          </p>
          <p>Equipo fundador: Brenda Segovia Quiroga, Reynaldo Ticona y Gabriel Sangüeza.</p>
        </div>
      </footer>
    </>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-3">
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="font-display text-2xl">{detail}</dd>
    </div>
  );
}
