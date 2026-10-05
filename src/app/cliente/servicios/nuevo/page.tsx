import type { Metadata } from "next";
import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { todayKey, tomorrowKey } from "@/lib/format";

export const metadata: Metadata = { title: "Solicitar servicio" };

export default async function NewServicePage() {
  await requireUser(["CLIENT"]);
  return (
    <>
      <PageHeader
        title="Solicitar servicio"
        description="Un dúo inclusivo irá a la dirección que indiques. El precio es 250 Bs."
      />
      <ServiceForm minDate={todayKey()} defaultDate={tomorrowKey()} />
    </>
  );
}
