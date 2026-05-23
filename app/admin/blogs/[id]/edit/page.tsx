import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { BlogInput } from "@/lib/validators";

import { PageHeader } from "../../../_components/PageHeader";
import { BlogForm } from "../../BlogForm";
import { updateBlog } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) notFound();

  const initial: BlogInput = {
    slug: blog.slug,
    status: blog.status,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    coverImage: blog.coverImage ?? "",
    tags: blog.tags,
    translations: blog.translations as unknown as BlogInput["translations"],
  };

  return (
    <>
      <PageHeader
        title="Edit blog post"
        breadcrumbs={[
          { label: "Blogs", href: "/admin/blogs" },
          { label: blog.slug },
        ]}
      />
      <BlogForm
        initial={initial}
        mode="edit"
        onSubmit={async (values) => {
          "use server";
          await updateBlog(id, values);
        }}
      />
    </>
  );
}
