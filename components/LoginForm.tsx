"use client";

import { useActionState, useState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/offer";

const initial: AuthState = {};

export function LoginForm({
  nextPath,
  framed = true,
}: {
  nextPath?: string;
  framed?: boolean;
}) {
  const [state, formAction, pending] = useActionState(login, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const errorId = "login-error";
  const describedBy = state.error ? errorId : undefined;

  return (
    <div
      className={
        framed
          ? "rounded-3xl border border-line bg-card p-5 shadow-[0_18px_50px_-32px_rgba(28,25,21,0.8)] sm:p-6"
          : ""
      }
    >
      <div className="mb-5 h-1.5 w-16 rounded-full bg-gold" aria-hidden="true" />
      <h2 className="font-display text-4xl text-balance">Ingresar</h2>
      <p className="mt-2 text-muted">Use su correo de Aura para ver sus servicios.</p>

      <form action={formAction} className="mt-6 space-y-4" aria-busy={pending}>
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div>
          <label htmlFor="email" className="mb-1.5 block font-bold">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={pending}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={describedBy}
            className={`min-h-12 w-full rounded-xl border bg-white px-3 disabled:opacity-70 ${state.error ? "border-clay" : "border-line"}`}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block font-bold">
            Contraseña
          </label>
          <div className="flex gap-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={pending}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={state.error ? true : undefined}
              aria-describedby={describedBy}
              className={`min-h-12 min-w-0 flex-1 rounded-xl border bg-white px-3 disabled:opacity-70 ${state.error ? "border-clay" : "border-line"}`}
            />
            <button
              type="button"
              className="min-h-12 shrink-0 rounded-xl border border-line bg-white px-3 font-bold text-pine hover:bg-sky-soft"
              aria-pressed={showPassword}
              aria-controls="password"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        {state.error ? (
          <p id={errorId} role="alert" className="rounded-xl bg-clay-soft px-3 py-3 font-bold text-clay">
            {state.error}
          </p>
        ) : null}
        <SubmitButton
          pendingLabel="Ingresando…"
          className="min-h-12 w-full rounded-full bg-pine px-5 text-lg font-bold text-white hover:bg-pine-dark"
        >
          Ingresar
        </SubmitButton>
        <p className="text-sm text-muted">La sesión se mantiene en este navegador durante unos días.</p>
      </form>

      <details className="mt-6 rounded-2xl border border-line bg-white">
        <summary className="min-h-12 cursor-pointer px-4 py-3 font-bold">
          Probar con una cuenta de demostración
        </summary>
        <div className="space-y-3 px-4 pb-4">
          <p className="text-sm text-muted">
            Contraseña compartida: <span className="font-bold text-ink">{DEMO_PASSWORD}</span>
          </p>
          <ul className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => {
              const selected = chosen === account.email;
              return (
                <li key={account.email}>
                  <button
                    type="button"
                    disabled={pending}
                    aria-pressed={selected}
                    className={`flex min-h-12 w-full flex-col justify-center rounded-xl border px-3 py-2 text-left hover:bg-gold-soft disabled:opacity-70 ${selected ? "border-pine bg-sky-soft" : "border-line bg-card"}`}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setChosen(account.email);
                    }}
                  >
                    <span className="font-bold">{account.name}</span>
                    <span className="text-sm text-muted">
                      {account.roleLabel} · {account.email}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {chosen ? (
            <p role="status" className="text-sm font-bold text-pine">
              Datos listos. Pulse Ingresar para continuar.
            </p>
          ) : null}
        </div>
      </details>
    </div>
  );
}
