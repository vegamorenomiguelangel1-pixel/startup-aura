import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { one } from "@/lib/flash";
import { homeForRole, isRole } from "@/lib/roles";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const user = await getCurrentUser();
  if (user && isRole(user.role)) redirect(homeForRole(user.role));
  const nextPath = one((await searchParams).next);

  return (
    <main id="contenido" className="mx-auto grid min-h-full w-full max-w-xl px-4 py-8">
      <Logo />
      <h1 className="mt-8 font-display text-4xl">Ingresar</h1>
      <p className="mt-2 text-lg text-muted">Panel del Servicio Dúo Inclusivo.</p>
      <div className="mt-6">
        <LoginForm accounts={DEMO_ACCOUNTS} nextPath={nextPath} />
      </div>
    </main>
  );
}
