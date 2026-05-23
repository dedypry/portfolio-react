import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { SkillGroupInput } from "@/lib/validators";

import { PageHeader } from "../../../_components/PageHeader";
import { SkillGroupForm } from "../../SkillGroupForm";
import { updateSkillGroup } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditSkillGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.skillGroup.findUnique({ where: { id } });
  if (!item) notFound();

  const initial: SkillGroupInput = {
    key: item.key,
    order: item.order,
    translations: item.translations as unknown as SkillGroupInput["translations"],
  };

  return (
    <>
      <PageHeader
        title={`Edit · ${item.key}`}
        breadcrumbs={[
          { label: "Skills", href: "/admin/skills" },
          { label: item.key },
        ]}
      />
      <SkillGroupForm
        initial={initial}
        mode="edit"
        onSubmit={async (values) => {
          "use server";
          await updateSkillGroup(id, values);
        }}
      />
    </>
  );
}
