"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="contenido" className="mx-auto flex min-h-[50vh] max-w-xl flex-col justify-center px-4 py-16">
      <h1 className="font-display text-4xl">No pudimos cargar esta página</h1>
      <p className="mt-3 text-muted">Inténtalo otra vez. Si sigue fallando, vuelve a ingresar.</p>
      <button type="button" onClick={reset} className="mt-6 inline-flex min-h-12 items-center self-start rounded-xl bg-teal px-4 font-bold text-white">
        Reintentar
      </button>
    </main>
  );
}
