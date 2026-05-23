import type { ProjectInput } from "@/lib/validators";

import { PageHeader } from "../../_components/PageHeader";
import { ProjectForm } from "../ProjectForm";
import { createProjectAndRedirect } from "../actions";

const EMPTY: ProjectInput = {
  category: "Web",
  accent: "",
  link: "",
  stack: [],
  coverImage: "",
  order: 0,
  featured: false,
  translations: {
    en: { name: "", tagline: "", description: "" },
    id: { name: "", tagline: "", description: "" },
  },
};

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        title="New project"
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: "New" },
        ]}
      />
      <ProjectForm
        initial={EMPTY}
        mode="create"
        onSubmit={createProjectAndRedirect}
      />
    </>
  );
}
