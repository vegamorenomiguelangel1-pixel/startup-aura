import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { isRole } from "@/lib/roles";

const nav = [
  { href: "/cliente", label: "Inicio" },
  { href: "/cliente/servicios", label: "Mis servicios" },
  { href: "/cliente/servicios/nuevo", label: "Solicitar" },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["CLIENT"]);
  if (!isRole(user.role)) return null;
  return (
    <AppShell user={{ name: user.name, role: user.role }} nav={nav}>
      {children}
    </AppShell>
  );
}
