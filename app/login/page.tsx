import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { homeForRole } from "@/lib/labels";

export const metadata: Metadata = { title: "Ingresar" };

function publicNext(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return undefined;
  }
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(homeForRole(user.role));
  const nextPath = publicNext((await searchParams).next);

  return (
    <main id="contenido" className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-6">
        <Logo />
      </div>
      <LoginForm nextPath={nextPath} />
    </main>
  );
}
