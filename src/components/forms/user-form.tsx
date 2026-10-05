"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/users";
import type { ActionState } from "@/lib/form";
import { ROLE_LABEL, ROLES } from "@/lib/roles";
import { SubmitButton } from "../submit-button";
import { SelectField, TextField } from "../ui";

export function UserForm() {
  const initial: ActionState = { values: { role: "EMPLOYEE" } };
  const [state, action] = useActionState(createUser, initial);
  const values = { ...initial.values, ...state.values };
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 font-bold text-clay">
          {state.error}
        </p>
      ) : null}
      <TextField id="name" name="name" label="Nombre" required autoComplete="name" defaultValue={values.name} error={errors.name} />
      <TextField id="email" name="email" type="email" label="Correo" required autoComplete="off" defaultValue={values.email} error={errors.email} />
      <TextField id="phone" name="phone" type="tel" label="Celular" autoComplete="tel" defaultValue={values.phone} error={errors.phone} hint="Opcional." />
      <TextField id="password" name="password" type="password" label="Contraseña temporal" required autoComplete="new-password" error={errors.password} hint="Mínimo 8 caracteres. Compártela por un canal seguro." />
      <SelectField id="role" name="role" label="Rol" required defaultValue={values.role} error={errors.role}>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABEL[role]}
          </option>
        ))}
      </SelectField>
      <SubmitButton pendingLabel="Creando…">Crear usuario</SubmitButton>
    </form>
  );
}
