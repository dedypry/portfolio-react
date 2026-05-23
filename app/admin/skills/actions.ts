"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  skillGroupSchema,
  skillSchema,
  type SkillGroupInput,
  type SkillInput,
} from "@/lib/validators";

const requireAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
};

const revalidate = () => {
  revalidatePath("/admin/skills");
  revalidatePath("/", "layout");
};

/* ─── SkillGroup ──────────────────────────────────── */

export async function createSkillGroup(input: SkillGroupInput) {
  await requireAuth();
  const data = skillGroupSchema.parse(input);
  await prisma.skillGroup.create({ data });
  revalidate();
}

export async function updateSkillGroup(id: string, input: SkillGroupInput) {
  await requireAuth();
  const data = skillGroupSchema.parse(input);
  await prisma.skillGroup.update({ where: { id }, data });
  revalidate();
}

export async function deleteSkillGroup(id: string) {
  await requireAuth();
  await prisma.skillGroup.delete({ where: { id } });
  revalidate();
}

export async function createSkillGroupAndRedirect(input: SkillGroupInput) {
  await createSkillGroup(input);
  redirect("/admin/skills");
}

/* ─── Skill ───────────────────────────────────────── */

export async function createSkill(input: SkillInput) {
  await requireAuth();
  const data = skillSchema.parse(input);
  await prisma.skill.create({ data });
  revalidate();
}

export async function updateSkill(id: string, input: SkillInput) {
  await requireAuth();
  const data = skillSchema.parse(input);
  await prisma.skill.update({ where: { id }, data });
  revalidate();
}

export async function deleteSkill(id: string) {
  await requireAuth();
  await prisma.skill.delete({ where: { id } });
  revalidate();
}
