import Link from "next/link";
import { errorMessage, okMessage } from "@/lib/flash";

export const controlClass =
  "w-full min-h-12 rounded-xl border border-line bg-paper px-3 text-base text-ink";

export function buttonClass(variant: "primary" | "secondary" | "ghost" | "danger" = "primary") {
  const base =
    "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-center text-base font-bold disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-teal text-white hover:bg-teal-dark",
    secondary: "border border-teal bg-paper text-teal hover:bg-foam",
    ghost: "text-ink hover:bg-sand",
    danger: "border border-clay bg-paper text-clay hover:bg-clay-soft",
  };
  return `${base} ${variants[variant]}`;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-1 text-sm font-bold text-teal">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-lg text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Flash({ error, ok }: { error?: string; ok?: string }) {
  const errorText = errorMessage(error);
  const okText = okMessage(ok);
  if (!errorText && !okText) return null;
  if (errorText) {
    return (
      <div role="alert" className="mb-4 rounded-xl border border-clay/30 bg-clay-soft px-4 py-3 font-bold text-clay">
        {errorText}
      </div>
    );
  }
  return (
    <div role="status" className="mb-4 rounded-xl border border-moss/20 bg-moss-soft px-4 py-3 font-bold text-moss">
      {okText}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-10 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {body ? <p className="mx-auto mt-2 max-w-md text-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TextField({
  id,
  name,
  label,
  type = "text",
  error,
  hint,
  defaultValue,
  required,
  autoComplete,
  min,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
  min?: string;
  placeholder?: string;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        autoComplete={autoComplete}
        min={min}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={controlClass}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  error,
  hint,
  defaultValue,
  rows = 3,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
  rows?: number;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClass} min-h-28 py-3`}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  id,
  name,
  label,
  error,
  hint,
  defaultValue,
  required,
  children,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={controlClass}
      >
        {children}
      </select>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Link href={href} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}
