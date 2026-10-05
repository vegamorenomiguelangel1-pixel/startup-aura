import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { homeForRole } from "@/lib/labels";
import { OFFER } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingrese a Aura para ver y gestionar sus servicios.",
};

function publicNext(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return undefined;
  }
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(homeForRole(user.role));
  const nextPath = publicNext((await searchParams).next);

  return (
    <main id="contenido" className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
      <section className="on-pine relative overflow-hidden bg-pine px-5 py-6 text-[#fffcf7] sm:px-10 sm:py-10 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 hidden lg:block">
          <svg width="340" height="280" viewBox="0 0 340 280">
            <circle cx="120" cy="160" r="110" fill="#fffcf7" fillOpacity="0.08" />
            <circle cx="210" cy="150" r="110" fill="#e2b657" fillOpacity="0.22" />
          </svg>
        </div>
        <div className="relative">
          <Logo tone="paper" />
        </div>
        <div className="relative mt-6 max-w-xl lg:mt-0">
          <p className="text-sm font-bold text-[#d7efe6]">{OFFER.city}</p>
          <h1 className="mt-2 font-display text-[2rem] leading-[1.15] text-balance sm:mt-3 sm:text-5xl lg:text-6xl">
            {OFFER.tagline}
          </h1>
          <p className="mt-3 text-sm font-bold text-[#d7efe6] sm:hidden">
            {OFFER.durationLabel} · {formatPrice(OFFER.priceBs)}
          </p>
          <p className="mt-4 hidden max-w-md text-[#d7efe6] sm:block sm:text-lg">
            {OFFER.name}: limpieza en equipo, con una persona con discapacidad o su tutor y un
            compañero de apoyo.
          </p>
          <dl className="mt-8 hidden max-w-md grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:grid">
            <div>
              <dt className="text-sm text-[#d7efe6]">Duración</dt>
              <dd className="mt-1 font-display text-2xl leading-tight">{OFFER.durationLabel}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#d7efe6]">Precio</dt>
              <dd className="mt-1 font-display text-2xl leading-tight">{formatPrice(OFFER.priceBs)}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#d7efe6]">Equipo</dt>
              <dd className="mt-1 font-display text-2xl leading-tight">Dúo</dd>
            </div>
          </dl>
        </div>
        <p className="relative mt-8 hidden text-sm sm:block lg:mt-0">
          <a className="font-bold text-[#d7efe6] underline underline-offset-4" href={OFFER.site}>
            auraservicio.com
          </a>
        </p>
      </section>

      <section className="flex items-center bg-card px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto w-full max-w-md">
          <LoginForm nextPath={nextPath} framed={false} />
        </div>
      </section>
    </main>
  );
}
