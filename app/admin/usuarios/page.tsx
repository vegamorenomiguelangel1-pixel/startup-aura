import type { Metadata } from "next";
import { CreateUserForm, RoleForm } from "@/components/UsersManager";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ROLE_LABEL, type AppRole } from "@/lib/labels";

export const metadata: Metadata = { title: "Usuarios" };

const roleOrder: Record<AppRole, number> = { ADMIN: 0, EMPLOYEE: 1, CLIENT: 2 };

export default async function UsuariosPage() {
  const admin = await requireUser("ADMIN");
  const [users, duos] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        duoRole: true,
        duo: { select: { name: true } },
      },
    }),
    prisma.duo.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const ordered = [...users].sort((a, b) => {
    const byRole = roleOrder[a.role as AppRole] - roleOrder[b.role as AppRole];
    if (byRole !== 0) return byRole;
    return a.name.localeCompare(b.name, "es");
  });

  return (
    <>
      <h1 className="font-display text-4xl">Usuarios y roles</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Cree cuentas para clientes y para el dúo. El rol define qué panel ve cada persona.
      </p>

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <CreateUserForm duos={duos} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl">Personas ({ordered.length})</h2>
        <ul className="mt-4 space-y-3">
          {ordered.map((person) => (
            <li key={person.id} className="rounded-2xl border border-line bg-card px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{person.name}</p>
                  <p className="text-sm text-muted">{person.email}</p>
                  <p className="text-sm text-muted">
                    {ROLE_LABEL[person.role as AppRole]}
                    {person.duo ? ` · ${person.duo.name}` : ""}
                    {person.duoRole ? ` · ${person.duoRole}` : ""}
                    {person.phone ? ` · ${person.phone}` : ""}
                  </p>
                </div>
                <RoleForm
                  userId={person.id}
                  role={person.role as AppRole}
                  disabled={person.id === admin.id}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
