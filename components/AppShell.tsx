"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { homeForRole, ROLE_LABEL, type AppRole } from "@/lib/labels";

const NAV: Record<AppRole, { href: string; label: string }[]> = {
  CLIENT: [
    { href: "/cliente", label: "Mis servicios" },
    { href: "/cliente/nuevo", label: "Solicitar servicio" },
  ],
  EMPLOYEE: [{ href: "/empleado", label: "Mis servicios" }],
  ADMIN: [
    { href: "/admin", label: "Servicios" },
    { href: "/admin/usuarios", label: "Usuarios" },
  ],
};

function isCurrent(pathname: string, href: string) {
  if (href === "/cliente") {
    return pathname === "/cliente" || pathname.startsWith("/cliente/servicios");
  }
  if (href === "/admin") {
    return pathname === "/admin" || pathname.startsWith("/admin/servicios");
  }
  if (href === "/empleado") return pathname === "/empleado" || pathname.startsWith("/empleado/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  user,
  logoutAction,
  children,
}: {
  user: { name: string; role: AppRole };
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[user.role];

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
          <Logo href={homeForRole(user.role)} />
          <div className="ml-auto flex items-center gap-3">
            <p className="text-right leading-tight">
              <span className="block font-bold">{user.name}</span>
              <span className="text-sm text-muted">{ROLE_LABEL[user.role]}</span>
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-bold"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
          <nav aria-label="Secciones" className="basis-full">
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full px-4 font-bold ${
                        current ? "bg-pine text-white" : "text-ink hover:bg-paper"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      <main id="contenido" className="mx-auto w-full max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
