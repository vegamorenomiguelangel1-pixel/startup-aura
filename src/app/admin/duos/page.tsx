import type { Metadata } from "next";
import { removeFromDuo } from "@/actions/users";
import { DuoForm } from "@/components/forms/duo-form";
import { SubmitButton } from "@/components/submit-button";
import { Flash, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { one } from "@/lib/flash";
import { prisma } from "@/lib/prisma";
import { DUO_ROLE_LABEL, isDuoRole } from "@/lib/roles";

export const metadata: Metadata = { title: "Dúos" };

export default async function DuosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  await requireUser(["ADMIN"]);
  const query = await searchParams;
  const [duos, available] = await Promise.all([
    prisma.duo.findMany({
      include: { members: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "EMPLOYEE", duoId: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Dúos"
        description="Cada dúo junta a un integrante con un compañero de apoyo. Solo un dúo completo se puede asignar a un servicio."
      />
      <Flash ok={one(query.ok)} error={one(query.error)} />
      <ul className="mb-8 grid gap-3">
        {duos.map((duo) => (
          <li key={duo.id} className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-2xl">{duo.name}</h2>
            {duo.notes ? <p className="mt-1 text-muted">{duo.notes}</p> : null}
            {duo.members.length === 2 ? (
              <p className="mt-2 text-sm font-bold text-moss">Listo para asignar</p>
            ) : (
              <p className="mt-2 text-sm font-bold text-clay">Necesita dos personas para asignarse a un servicio.</p>
            )}
            {duo.members.length === 0 ? <p className="mt-3 text-muted">Sin personas.</p> : null}
            <ul className="mt-3 grid gap-2">
              {duo.members.map((member) => (
                <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cream px-3 py-2">
                  <p>
                    <span className="font-bold">{member.name}</span>
                    {member.duoRole && isDuoRole(member.duoRole) ? (
                      <span className="block text-sm text-muted">{DUO_ROLE_LABEL[member.duoRole]}</span>
                    ) : null}
                  </p>
                  <form action={removeFromDuo}>
                    <input type="hidden" name="userId" value={member.id} />
                    <SubmitButton variant="danger" pendingLabel="Quitando…">
                      Quitar del dúo
                    </SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {available.length >= 2 ? (
        <DuoForm people={available} />
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-paper px-5 py-6 text-muted">
          Para armar otro dúo hacen falta al menos dos personas del equipo que no estén ya en uno. Créalas en Usuarios.
        </p>
      )}
    </>
  );
}
