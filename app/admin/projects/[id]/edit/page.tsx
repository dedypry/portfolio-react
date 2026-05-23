import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { ProjectInput } from "@/lib/validators";
import type { ProjectTx } from "@/lib/translations";

import { PageHeader } from "../../../_components/PageHeader";
import { ProjectForm } from "../../ProjectForm";
import { updateProject } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.project.findUnique({ where: { id } });
  if (!item) notFound();

  const initial: ProjectInput = {
    category: item.category,
    accent: item.accent ?? "",
    link: item.link ?? "",
    stack: item.stack,
    coverImage: item.coverImage ?? "",
    order: item.order,
    featured: item.featured,
    translations: item.translations as unknown as ProjectInput["translations"],
  };

  const name =
    (item.translations as unknown as Record<string, ProjectTx>)?.en?.name ??
    "Untitled";

  return (
    <>
      <PageHeader
        title={`Edit · ${name}`}
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: name },
        ]}
      />
      <ProjectForm
        initial={initial}
        mode="edit"
        onSubmit={async (values) => {
          "use server";
          await updateProject(id, values);
        }}
      />
    </>
  );
}
