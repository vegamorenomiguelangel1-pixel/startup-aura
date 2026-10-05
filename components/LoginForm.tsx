"use client";

import { useActionState, useState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { DEMO_ACCOUNTS } from "@/lib/offer";

const initial: AuthState = {};

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction] = useActionState(login, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_18px_50px_-32px_rgba(28,25,21,0.8)] sm:p-6">
      <div className="mb-5 h-1.5 w-16 rounded-full bg-gold" aria-hidden="true" />
      <h2 className="font-display text-3xl">Ingresar</h2>
      <p className="mt-1 text-muted">Use su cuenta de Aura para ver sus servicios.</p>
      <form action={formAction} className="mt-5 space-y-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div>
          <label htmlFor="email" className="mb-1 block font-bold">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-line bg-white px-3"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-bold">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-line bg-white px-3"
          />
        </div>
        {state.error ? (
          <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-clay">
            {state.error}
          </p>
        ) : null}
        <SubmitButton
          pendingLabel="Ingresando…"
          className="min-h-12 w-full rounded-full bg-pine px-5 font-bold text-white hover:bg-pine-dark"
        >
          Ingresar
        </SubmitButton>
      </form>

      <section className="mt-6 border-t border-line pt-4" aria-labelledby="demo-cuentas">
        <h3 id="demo-cuentas" className="font-bold">
          Cuentas de demostración
        </h3>
        <p className="mt-1 text-sm text-muted">
          Todas usan la contraseña <span className="font-bold text-ink">{DEMO_ACCOUNTS[0].password}</span>.
        </p>
        <ul className="mt-3 space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-left hover:bg-gold-soft"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <span>
                  <span className="block font-bold">{account.roleLabel}</span>
                  <span className="text-sm text-muted">{account.email}</span>
                </span>
                <span className="text-sm font-bold text-pine">Usar</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
