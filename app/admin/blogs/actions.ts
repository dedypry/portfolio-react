"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import readingTimeOf from "reading-time";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogSchema, type BlogInput } from "@/lib/validators";

function computeReadingMinutes(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ");
  return Math.max(1, Math.round(readingTimeOf(plain).minutes));
}

export async function createBlog(input: BlogInput): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = blogSchema.parse(input);

  const exists = await prisma.blog.findUnique({ where: { slug: data.slug } });
  if (exists) throw new Error(`Slug "${data.slug}" already exists.`);

  const blog = await prisma.blog.create({
    data: {
      slug: data.slug,
      status: data.status,
      publishedAt:
        data.status === "PUBLISHED"
          ? data.publishedAt
            ? new Date(data.publishedAt)
            : new Date()
          : null,
      coverImage: data.coverImage || null,
      tags: data.tags,
      readingTime: computeReadingMinutes(data.translations.en.content),
      translations: data.translations,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/", "layout");

  return { id: blog.id };
}

export async function updateBlog(id: string, input: BlogInput) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const data = blogSchema.parse(input);

  const conflict = await prisma.blog.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (conflict) throw new Error(`Slug "${data.slug}" already exists.`);

  await prisma.blog.update({
    where: { id },
    data: {
      slug: data.slug,
      status: data.status,
      publishedAt:
        data.status === "PUBLISHED"
          ? data.publishedAt
            ? new Date(data.publishedAt)
            : new Date()
          : null,
      coverImage: data.coverImage || null,
      tags: data.tags,
      readingTime: computeReadingMinutes(data.translations.en.content),
      translations: data.translations,
    },
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/", "layout");
}

export async function deleteBlog(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/admin/blogs");
  revalidatePath("/", "layout");
}

export async function createBlogAndRedirect(input: BlogInput) {
  const { id } = await createBlog(input);
  redirect(`/admin/blogs/${id}/edit`);
}
