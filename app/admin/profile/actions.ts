"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators";
import type { ProfileInput } from "@/lib/validators";

export async function saveProfile(input: ProfileInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = profileSchema.parse(input);

  const existing = await prisma.profile.findFirst();

  await prisma.profile.upsert({
    where: { id: existing?.id ?? "__none__" },
    create: parsed,
    update: parsed,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/profile");
}
