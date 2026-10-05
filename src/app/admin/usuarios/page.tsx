import type { Metadata } from "next";
import { updateUser } from "@/actions/users";
import { SubmitButton } from "@/components/submit-button";
import { ActionLink, controlClass, Flash, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { one } from "@/lib/flash";
import { prisma } from "@/lib/prisma";
import { DUO_ROLE_LABEL, isDuoRole, isRole, ROLE_LABEL, ROLES } from "@/lib/roles";

export const metadata: Metadata = { title: "Usuarios" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  await requireUser(["ADMIN"]);
  const query = await searchParams;
  const users = await prisma.user.findMany({ include: { duo: true }, orderBy: { name: "asc" } });

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Cuentas de administración, equipo dúo y clientes. Un cambio de rol se aplica en la siguiente página."
        action={<ActionLink href="/admin/usuarios/nuevo">Nuevo usuario</ActionLink>}
      />
      <Flash ok={one(query.ok)} error={one(query.error)} />
      <ul className="grid gap-3">
        {users.map((user) => (
          <li key={user.id} className="rounded-2xl border border-line bg-paper p-4">
            <form action={updateUser} className="grid gap-3">
              <input type="hidden" name="userId" value={user.id} />
              <div>
                <h2 className="font-display text-2xl">{user.name}</h2>
                <p className="text-muted">{user.email}</p>
                {user.phone ? <p className="text-sm">{user.phone}</p> : null}
                {user.duo ? (
                  <p className="mt-1 text-sm font-bold text-teal">
                    {user.duo.name}
                    {user.duoRole && isDuoRole(user.duoRole) ? ` · ${DUO_ROLE_LABEL[user.duoRole]}` : ""}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div>
                  <label htmlFor={`role-${user.id}`} className="mb-1.5 block text-sm font-bold">
                    Rol de {user.name}
                  </label>
                  <select id={`role-${user.id}`} name="role" defaultValue={isRole(user.role) ? user.role : "CLIENT"} className={controlClass}>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`password-${user.id}`} className="mb-1.5 block text-sm font-bold">
                    Nueva contraseña
                  </label>
                  <input
                    id={`password-${user.id}`}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Opcional"
                    className={controlClass}
                  />
                </div>
                <SubmitButton variant="secondary" pendingLabel="Guardando…">
                  Guardar
                </SubmitButton>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
