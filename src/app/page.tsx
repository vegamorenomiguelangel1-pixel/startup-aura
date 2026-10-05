import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonClass } from "@/components/ui";

const facts = [
  { title: "4 a 5 horas", body: "Una jornada más corta que el turno tradicional de 8 horas." },
  { title: "250 Bs", body: "Precio del Servicio Dúo Inclusivo, por debajo del promedio de 280 Bs." },
  { title: "Un dúo", body: "Una persona con discapacidad o tutor, junto a un compañero de apoyo." },
];

const steps = [
  { title: "El cliente solicita", body: "Indica dirección, zona y horario en Santa Cruz." },
  { title: "Administración asigna", body: "Elige el dúo que hará la limpieza." },
  { title: "El equipo actualiza", body: "En camino, en progreso y completado, desde el celular." },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-4">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <Link href="/login" className={buttonClass("primary")}>
          Ingresar
        </Link>
      </header>
      <main id="contenido" className="flex-1 pb-16">
        <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div>
            <p className="font-bold text-teal">Santa Cruz de la Sierra, Bolivia</p>
            <h1 className="mt-3 max-w-xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              Limpiamos espacios, transformamos vidas.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Aura coordina el Servicio Dúo Inclusivo: limpieza del hogar o la oficina hecha por una pareja de trabajo, con inclusión laboral en cada visita.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/login" className={buttonClass("primary")}>
                Entrar al panel
              </Link>
              <a href="#como-funciona" className={buttonClass("secondary")}>
                Cómo se agenda
              </a>
            </div>
          </div>
          <figure className="rounded-3xl border border-line bg-paper p-5 shadow-[0_16px_40px_rgba(28,25,21,0.06)]">
            <figcaption className="text-sm font-bold text-teal">Ejemplo de un servicio</figcaption>
            <p className="mt-3 font-display text-3xl">Hoy · 09:00</p>
            <p className="mt-1 text-lg">Las Palmas</p>
            <p className="text-muted">Condominio Las Palmas, calle 8, casa 21</p>
            <p className="mt-4 font-bold">250 Bs · 4,5 h</p>
            <ul className="mt-4 grid gap-2">
              <li className="rounded-xl bg-cream px-3 py-2">Ana Rojas · Compañero de apoyo</li>
              <li className="rounded-xl bg-cream px-3 py-2">Mateo Vargas · Integrante del dúo</li>
            </ul>
          </figure>
        </section>

        <section aria-label="La oferta" className="grid gap-3 md:grid-cols-3">
          {facts.map((fact) => (
            <article key={fact.title} className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="font-display text-2xl">{fact.title}</h2>
              <p className="mt-2 text-muted">{fact.body}</p>
            </article>
          ))}
        </section>

        <section id="como-funciona" className="mt-14">
          <h2 className="font-display text-3xl">Cómo funciona el panel</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-teal p-5 text-white">
                <p className="text-sm font-bold text-white/80">Paso {index + 1}</p>
                <h3 className="mt-1 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-white/90">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="border-t border-line py-6 text-sm text-muted">
        <p>Equipo fundador: Brenda Segovia Quiroga, Reynaldo Ticona y Gabriel Sangüeza.</p>
        <p className="mt-1">
          <a className="font-bold text-teal underline" href="https://www.auraservicio.com">
            auraservicio.com
          </a>
        </p>
      </footer>
    </div>
  );
}
