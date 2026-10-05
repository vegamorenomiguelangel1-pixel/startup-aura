"use client";

import { useActionState, useState } from "react";
import { assignEmployees, type ActionResult } from "@/app/actions/services";
import { SubmitButton } from "@/components/SubmitButton";

const initial: ActionResult = {};

type EmployeeOption = {
  id: string;
  name: string;
  duoRole: string | null;
  duoId: string | null;
  duoName: string | null;
};

export function AssignForm({
  serviceId,
  employees,
  assignedIds,
  duos,
}: {
  serviceId: string;
  employees: EmployeeOption[];
  assignedIds: string[];
  duos: { id: string; name: string; memberIds: string[] }[];
}) {
  const [state, formAction] = useActionState(assignEmployees, initial);
  const [selected, setSelected] = useState<string[]>(assignedIds);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />
      {selected.map((id) => (
        <input key={id} type="hidden" name="employeeId" value={id} />
      ))}
      {duos.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {duos.map((duo) => (
            <button
              key={duo.id}
              type="button"
              className="min-h-11 rounded-full border border-pine px-4 font-bold text-pine"
              onClick={() => setSelected(duo.memberIds)}
            >
              Asignar {duo.name}
            </button>
          ))}
        </div>
      ) : null}
      <fieldset>
        <legend className="mb-2 font-bold">Personas del equipo</legend>
        <ul className="space-y-2">
          {employees.map((employee) => {
            const checked = selected.includes(employee.id);
            return (
              <li key={employee.id}>
                <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-white px-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={checked}
                    onChange={() => toggle(employee.id)}
                  />
                  <span>
                    <span className="block font-bold">{employee.name}</span>
                    <span className="text-sm text-muted">
                      {[employee.duoRole, employee.duoName].filter(Boolean).join(" · ") ||
                        "Sin dúo"}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      {selected.length === 1 ? (
        <p className="text-sm text-muted">
          Un servicio dúo suele incluir dos personas. Puede guardar igual si es intencional.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-clay">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="rounded-xl bg-sky-soft px-3 py-2 text-pine-dark">
          {state.success}
        </p>
      ) : null}
      <SubmitButton className="min-h-12 rounded-full bg-pine px-5 font-bold text-white hover:bg-pine-dark">
        Guardar asignación
      </SubmitButton>
    </form>
  );
}
