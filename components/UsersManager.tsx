"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUser, updateUserRole, type ActionResult } from "@/app/actions/users";
import { SubmitButton } from "@/components/SubmitButton";
import { ROLE_LABEL, ROLES, type AppRole } from "@/lib/labels";

const initial: ActionResult = {};

export function CreateUserForm({
  duos,
}: {
  duos: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState(createUser, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} autoComplete="off" className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl">Nueva persona</h2>
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block font-bold">
          Nombre
        </label>
        <input id="name" name="name" required maxLength={80} className="field" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block font-bold">
          Correo
        </label>
        <input id="email" name="email" type="email" required maxLength={120} className="field" />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block font-bold">
          Teléfono
        </label>
        <input id="phone" name="phone" type="tel" maxLength={20} className="field" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block font-bold">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          autoComplete="new-password"
          className="field"
        />
      </div>
      <div>
        <label htmlFor="role" className="mb-1 block font-bold">
          Rol
        </label>
        <select id="role" name="role" defaultValue="EMPLOYEE" className="field">
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABEL[role]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="duoId" className="mb-1 block font-bold">
          Dúo (si es empleado)
        </label>
        <select id="duoId" name="duoId" defaultValue="" className="field">
          <option value="">Sin dúo</option>
          {duos.map((duo) => (
            <option key={duo.id} value={duo.id}>
              {duo.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="duoRole" className="mb-1 block font-bold">
          Función en el dúo
        </label>
        <input
          id="duoRole"
          name="duoRole"
          maxLength={80}
          placeholder="Ej. Compañero de apoyo"
          className="field"
        />
      </div>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-clay sm:col-span-2">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="rounded-xl bg-sky-soft px-3 py-2 text-pine-dark sm:col-span-2">
          {state.success}
        </p>
      ) : null}
      <div>
        <SubmitButton className="min-h-12 rounded-full bg-pine px-5 font-bold text-white hover:bg-pine-dark">
          Crear usuario
        </SubmitButton>
      </div>
    </form>
  );
}

export function RoleForm({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: AppRole;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState(updateUserRole, initial);
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <label className="sr-only" htmlFor={`role-${userId}`}>
        Rol
      </label>
      <select
        id={`role-${userId}`}
        name="role"
        defaultValue={role}
        disabled={disabled}
        className="min-h-11 rounded-xl border border-line bg-white px-2"
      >
        {ROLES.map((item) => (
          <option key={item} value={item}>
            {ROLE_LABEL[item]}
          </option>
        ))}
      </select>
      {disabled ? (
        <span className="text-sm text-muted">Su cuenta</span>
      ) : (
        <SubmitButton
          pendingLabel="…"
          className="min-h-11 rounded-full border border-line px-4 font-bold"
        >
          Guardar rol
        </SubmitButton>
      )}
      {state.error ? (
        <span role="alert" className="text-sm text-clay">
          {state.error}
        </span>
      ) : null}
      {state.success ? (
        <span role="status" className="text-sm text-pine-dark">
          {state.success}
        </span>
      ) : null}
    </form>
  );
}
