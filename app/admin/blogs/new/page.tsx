import type { BlogInput } from "@/lib/validators";

import { PageHeader } from "../../_components/PageHeader";
import { BlogForm } from "../BlogForm";
import { createBlogAndRedirect } from "../actions";

const EMPTY: BlogInput = {
  slug: "",
  status: "DRAFT",
  publishedAt: null,
  coverImage: "",
  tags: [],
  translations: {
    en: { title: "", excerpt: "", content: "" },
    id: { title: "", excerpt: "", content: "" },
  },
};

export default function NewBlogPage() {
  return (
    <>
      <PageHeader
        title="New blog post"
        breadcrumbs={[
          { label: "Blogs", href: "/admin/blogs" },
          { label: "New" },
        ]}
      />
      <BlogForm
        initial={EMPTY}
        mode="create"
        onSubmit={createBlogAndRedirect}
      />
    </>
  );
}
