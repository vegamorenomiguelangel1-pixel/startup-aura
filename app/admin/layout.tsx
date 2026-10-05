import { logout } from "@/app/actions/auth";
import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("ADMIN");
  return (
    <AppShell user={{ name: user.name, role: user.role }} logoutAction={logout}>
      {children}
    </AppShell>
  );
}
