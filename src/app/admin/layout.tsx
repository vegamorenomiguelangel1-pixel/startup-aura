import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { isRole } from "@/lib/roles";

const nav = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/duos", label: "Dúos" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["ADMIN"]);
  if (!isRole(user.role)) return null;
  return (
    <AppShell user={{ name: user.name, role: user.role }} nav={nav}>
      {children}
    </AppShell>
  );
}
