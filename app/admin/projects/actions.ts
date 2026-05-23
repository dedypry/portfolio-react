"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validators";

const normalize = (input: ProjectInput) => ({
  ...input,
  accent: input.accent || null,
  link: input.link || null,
  coverImage: input.coverImage || null,
});

export async function createProject(input: ProjectInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = projectSchema.parse(input);
  await prisma.project.create({ data: normalize(data) });

  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
}

export async function updateProject(id: string, input: ProjectInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = projectSchema.parse(input);
  await prisma.project.update({ where: { id }, data: normalize(data) });

  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
}

export async function createProjectAndRedirect(input: ProjectInput) {
  await createProject(input);
  redirect("/admin/projects");
}
