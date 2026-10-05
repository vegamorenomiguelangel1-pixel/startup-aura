import { notFound } from "next/navigation";
import { AdminStatusForm } from "@/components/AdminStatusForm";
import { AssignForm } from "@/components/AssignForm";
import { ServiceDetail } from "@/components/ServiceDetail";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isHistoryStatus, type Status } from "@/lib/labels";
import { getService } from "@/lib/services";

export const metadata = { title: "Asignar servicio" };

export default async function AdminServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser("ADMIN");
  const { id } = await params;
  const [service, employees, duos] = await Promise.all([
    getService(id),
    prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        duoRole: true,
        duoId: true,
        duo: { select: { name: true } },
      },
    }),
    prisma.duo.findMany({
      orderBy: { name: "asc" },
      include: { members: { where: { role: "EMPLOYEE" }, select: { id: true } } },
    }),
  ]);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <ServiceDetail
        service={{ ...service, status: service.status as Status }}
        backHref="/admin"
        backLabel="Volver a servicios"
        showClient
        showPhones
        showEmail
        showMaps
      />
      <section className="rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-3xl">Asignar dúo</h2>
        <p className="mt-1 mb-4 text-muted">
          Al asignar personas a un servicio solicitado, pasa a asignado. Si quita a todo el equipo de
          un servicio asignado, vuelve a solicitado.
        </p>
        {isHistoryStatus(service.status as Status) ? (
          <p className="mb-4 text-sm text-muted">
            Este servicio ya está en el historial. Cambiar la asignación no modifica el estado.
          </p>
        ) : null}
        <AssignForm
          serviceId={service.id}
          assignedIds={service.assignments.map((item) => item.employeeId)}
          employees={employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            duoRole: employee.duoRole,
            duoId: employee.duoId,
            duoName: employee.duo?.name ?? null,
          }))}
          duos={duos.map((duo) => ({
            id: duo.id,
            name: duo.name,
            memberIds: duo.members.map((member) => member.id),
          }))}
        />
      </section>
      <section className="rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-3xl">Estado</h2>
        <p className="mt-1 mb-4 text-muted">
          El dúo avanza el estado en su panel. Use esta corrección solo si hace falta.
        </p>
        <AdminStatusForm serviceId={service.id} status={service.status as Status} />
      </section>
    </div>
  );
}
