"use client";

import { useActionState } from "react";
import { createDuo } from "@/actions/users";
import type { ActionState } from "@/lib/form";
import { SubmitButton } from "../submit-button";
import { SelectField, TextAreaField, TextField } from "../ui";

export function DuoForm({ people }: { people: { id: string; name: string }[] }) {
  const initial: ActionState = {};
  const [state, action] = useActionState(createDuo, initial);
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-paper p-5">
      <h2 className="font-display text-2xl">Nuevo dúo</h2>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 font-bold text-clay">
          {state.error}
        </p>
      ) : null}
      <TextField id="name" name="name" label="Nombre del dúo" required defaultValue={values.name} error={errors.name} />
      <SelectField id="apoyoId" name="apoyoId" label="Compañero de apoyo" required defaultValue={values.apoyoId} error={errors.apoyoId}>
        <option value="">Elegir</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </SelectField>
      <SelectField id="integranteId" name="integranteId" label="Integrante del dúo" required defaultValue={values.integranteId} error={errors.integranteId}>
        <option value="">Elegir</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </SelectField>
      <TextAreaField id="notes" name="notes" label="Notas" defaultValue={values.notes} error={errors.notes} />
      <SubmitButton pendingLabel="Creando dúo…">Crear dúo</SubmitButton>
    </form>
  );
}
