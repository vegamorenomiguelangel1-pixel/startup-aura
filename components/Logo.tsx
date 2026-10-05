import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-xl">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="10" fill="#0f5c4c" />
        <circle cx="14" cy="18" r="7" fill="#f4f0e8" />
        <circle cx="22" cy="18" r="7" fill="#e2b657" />
      </svg>
      <span className="font-display text-[1.7rem] leading-none font-semibold tracking-tight">
        Aura
      </span>
    </Link>
  );
}
