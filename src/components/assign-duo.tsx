import { assignDuo, unassignDuo } from "@/actions/services";
import { DUO_ROLE_LABEL, isDuoRole } from "@/lib/roles";
import { canAssignDuo, canUnassignDuo, isServiceStatus } from "@/lib/status";
import { SubmitButton } from "./submit-button";
import { ActionLink, controlClass } from "./ui";

type DuoOption = {
  id: string;
  name: string;
  members: { id: string; name: string; duoRole: string | null }[];
};

export function AssignDuo({
  serviceId,
  status,
  currentDuoId,
  duos,
}: {
  serviceId: string;
  status: string;
  currentDuoId: string | null;
  duos: DuoOption[];
}) {
  if (!isServiceStatus(status) || !canAssignDuo(status)) {
    return (
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-2xl">Asignación</h2>
        <p className="mt-2 text-muted">Este servicio ya terminó. La asignación queda como historial.</p>
      </section>
    );
  }

  const ready = duos.filter((duo) => duo.members.length === 2);
  return (
    <section className="rounded-2xl border border-line bg-paper p-5" aria-labelledby="asignar-duo">
      <h2 id="asignar-duo" className="font-display text-2xl">
        Asignar dúo
      </h2>
      <p className="mt-2 text-muted">El dúo necesita dos personas: integrante y compañero de apoyo.</p>
      {ready.length === 0 ? (
        <div className="mt-4">
          <p className="mb-3">No hay un dúo completo disponible.</p>
          <ActionLink href="/admin/duos" variant="secondary">
            Armar un dúo
          </ActionLink>
        </div>
      ) : (
        <form action={assignDuo} className="mt-4 grid gap-3">
          <input type="hidden" name="serviceId" value={serviceId} />
          <div>
            <label htmlFor="duoId" className="mb-1.5 block font-bold">
              Dúo
            </label>
            <select
              id="duoId"
              name="duoId"
              defaultValue={ready.some((duo) => duo.id === currentDuoId) ? (currentDuoId ?? undefined) : ready[0]?.id}
              required
              className={controlClass}
            >
              {ready.map((duo) => (
                <option key={duo.id} value={duo.id}>
                  {duo.name} — {duo.members.map((member) => memberLabel(member)).join(" y ")}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton pendingLabel="Asignando…">Asignar dúo</SubmitButton>
        </form>
      )}
      {canUnassignDuo(status) ? (
        <form action={unassignDuo} className="mt-3">
          <input type="hidden" name="serviceId" value={serviceId} />
          <SubmitButton variant="danger" pendingLabel="Retirando…">
            Retirar dúo
          </SubmitButton>
        </form>
      ) : null}
    </section>
  );
}

function memberLabel(member: { name: string; duoRole: string | null }) {
  const role = member.duoRole && isDuoRole(member.duoRole) ? DUO_ROLE_LABEL[member.duoRole] : "equipo";
  return `${member.name} (${role})`;
}
