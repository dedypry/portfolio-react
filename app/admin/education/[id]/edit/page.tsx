import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { EducationInput } from "@/lib/validators";

import { PageHeader } from "../../../_components/PageHeader";
import { EducationForm } from "../../EducationForm";
import { updateEducation } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) notFound();

  const initial: EducationInput = {
    school: item.school,
    location: item.location,
    period: item.period,
    order: item.order,
    translations: item.translations as unknown as EducationInput["translations"],
  };

  return (
    <>
      <PageHeader
        title={`Edit · ${item.school}`}
        breadcrumbs={[
          { label: "Education", href: "/admin/education" },
          { label: item.school },
        ]}
      />
      <EducationForm
        initial={initial}
        mode="edit"
        onSubmit={async (values) => {
          "use server";
          await updateEducation(id, values);
        }}
      />
    </>
  );
}
