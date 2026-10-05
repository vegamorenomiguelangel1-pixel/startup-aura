import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { isRole } from "@/lib/roles";

const nav = [
  { href: "/empleado", label: "Inicio" },
  { href: "/empleado/agenda", label: "Agenda" },
  { href: "/empleado/servicios", label: "Servicios" },
];

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["EMPLOYEE"]);
  if (!isRole(user.role)) return null;
  return (
    <AppShell user={{ name: user.name, role: user.role }} nav={nav}>
      {children}
    </AppShell>
  );
}
