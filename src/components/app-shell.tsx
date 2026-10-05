import { logout } from "@/actions/auth";
import { homeForRole, ROLE_LABEL, type Role } from "@/lib/roles";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function AppShell({
  user,
  nav,
  children,
}: {
  user: { name: string; role: Role };
  nav: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <div className="h-1.5 bg-teal" />
      <header className="border-b border-line bg-paper/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo href={homeForRole(user.role)} />
          <div className="flex items-center gap-3">
            <p className="text-right text-sm leading-tight">
              <span className="block font-bold">{user.name}</span>
              <span className="text-muted">{ROLE_LABEL[user.role]}</span>
            </p>
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center rounded-xl px-3 font-bold text-teal hover:bg-foam">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Secciones" className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          <NavLinks items={nav} />
        </nav>
      </header>
      <main id="contenido" className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
