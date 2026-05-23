import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { ExperienceInput } from "@/lib/validators";

import { PageHeader } from "../../../_components/PageHeader";
import { ExperienceForm } from "../../ExperienceForm";
import { updateExperience } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();

  const initial: ExperienceInput = {
    company: item.company,
    location: item.location,
    period: item.period,
    type: item.type,
    stack: item.stack,
    order: item.order,
    translations: item.translations as unknown as ExperienceInput["translations"],
  };

  return (
    <>
      <PageHeader
        title={`Edit · ${item.company}`}
        breadcrumbs={[
          { label: "Experience", href: "/admin/experiences" },
          { label: item.company },
        ]}
      />
      <ExperienceForm
        initial={initial}
        mode="edit"
        onSubmit={async (values) => {
          "use server";
          await updateExperience(id, values);
        }}
      />
    </>
  );
}
