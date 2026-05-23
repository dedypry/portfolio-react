"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { experienceSchema, type ExperienceInput } from "@/lib/validators";

export async function createExperience(input: ExperienceInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = experienceSchema.parse(input);
  await prisma.experience.create({ data });

  revalidatePath("/admin/experiences");
  revalidatePath("/", "layout");
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = experienceSchema.parse(input);
  await prisma.experience.update({ where: { id }, data });

  revalidatePath("/admin/experiences");
  revalidatePath("/", "layout");
}

export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experiences");
  revalidatePath("/", "layout");
}

export async function createExperienceAndRedirect(input: ExperienceInput) {
  await createExperience(input);
  redirect("/admin/experiences");
}
