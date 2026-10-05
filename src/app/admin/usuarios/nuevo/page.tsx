import type { Metadata } from "next";
import Link from "next/link";
import { UserForm } from "@/components/forms/user-form";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Nuevo usuario" };

export default async function NewUserPage() {
  await requireUser(["ADMIN"]);
  return (
    <>
      <Link href="/admin/usuarios" className="mb-4 inline-flex min-h-11 items-center font-bold text-teal">
        Volver a usuarios
      </Link>
      <PageHeader title="Nuevo usuario" description="La persona podrá ingresar con el correo y la contraseña que definas." />
      <UserForm />
    </>
  );
}
