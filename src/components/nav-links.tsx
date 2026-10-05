"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const home = item.href === "/admin" || item.href === "/empleado" || item.href === "/cliente";
        const current = home ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-4 font-bold ${
              current ? "bg-teal text-white" : "text-ink hover:bg-sand"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
