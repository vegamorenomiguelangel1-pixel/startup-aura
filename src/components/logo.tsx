import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-lg">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
        <rect width="36" height="36" rx="10" fill="#0e5c59" />
        <circle cx="14" cy="18" r="7" fill="none" stroke="#fffdf9" strokeWidth="2" />
        <circle cx="22" cy="18" r="7" fill="none" stroke="#f6e2cf" strokeWidth="2" />
      </svg>
      <span className="font-display text-2xl leading-none text-ink">Aura</span>
    </Link>
  );
}
