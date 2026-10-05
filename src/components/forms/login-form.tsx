"use client";

import { useActionState, useState } from "react";
import { login } from "@/actions/auth";
import type { DemoAccount } from "@/lib/demo-accounts";
import { ROLE_LABEL } from "@/lib/roles";
import { SubmitButton } from "../submit-button";
import { controlClass } from "../ui";

export function LoginForm({ accounts, nextPath }: { accounts: DemoAccount[]; nextPath?: string }) {
  const [state, action] = useActionState(login, {});
  const [email, setEmail] = useState(state.values?.email ?? "");
  const [password, setPassword] = useState("");

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-4">
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
        <div>
          <label htmlFor="email" className="mb-1.5 block font-bold">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={state.fieldErrors?.email || state.error ? true : undefined}
            aria-describedby={state.error ? "login-error" : undefined}
            className={controlClass}
          />
          {state.fieldErrors?.email ? <p className="mt-1 text-sm font-bold text-clay">{state.fieldErrors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block font-bold">
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
            aria-invalid={state.fieldErrors?.password || state.error ? true : undefined}
            className={controlClass}
          />
          {state.fieldErrors?.password ? (
            <p className="mt-1 text-sm font-bold text-clay">{state.fieldErrors.password}</p>
          ) : null}
        </div>
        {state.error ? (
          <p id="login-error" role="alert" className="rounded-xl bg-clay-soft px-3 py-2 font-bold text-clay">
            {state.error}
          </p>
        ) : null}
        <SubmitButton pendingLabel="Ingresando…">Ingresar</SubmitButton>
      </form>

      <section aria-labelledby="cuentas-demo">
        <h2 id="cuentas-demo" className="font-display text-2xl">
          Cuentas de demostración
        </h2>
        <p className="mt-1 text-sm text-muted">Datos locales para probar el panel. No son accesos reales.</p>
        <ul className="mt-3 grid gap-2">
          {accounts.map((account) => (
            <li key={account.email} className="rounded-xl border border-line bg-cream p-3">
              <p className="font-bold">
                {account.name} · {ROLE_LABEL[account.role]}
              </p>
              <p className="text-sm text-muted">{account.blurb}</p>
              <p className="mt-1 text-sm">
                <span className="font-bold">{account.email}</span>
                <span className="text-muted"> · {account.password}</span>
              </p>
              <button
                type="button"
                className="mt-2 inline-flex min-h-11 items-center font-bold text-teal underline"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                Usar esta cuenta
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
