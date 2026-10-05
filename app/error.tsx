"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="contenido" className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl">Algo salió mal</h1>
      <p className="mt-3 text-muted">No pudimos completar esta acción. Intente de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-12 rounded-full bg-pine px-5 font-bold text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
