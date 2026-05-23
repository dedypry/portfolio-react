"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { educationSchema, type EducationInput } from "@/lib/validators";

export async function createEducation(input: EducationInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = educationSchema.parse(input);
  await prisma.education.create({ data });

  revalidatePath("/admin/education");
  revalidatePath("/", "layout");
}

export async function updateEducation(id: string, input: EducationInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = educationSchema.parse(input);
  await prisma.education.update({ where: { id }, data });

  revalidatePath("/admin/education");
  revalidatePath("/", "layout");
}

export async function deleteEducation(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.education.delete({ where: { id } });
  revalidatePath("/admin/education");
  revalidatePath("/", "layout");
}

export async function createEducationAndRedirect(input: EducationInput) {
  await createEducation(input);
  redirect("/admin/education");
}
