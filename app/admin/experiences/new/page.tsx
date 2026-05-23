import type { ExperienceInput } from "@/lib/validators";

import { PageHeader } from "../../_components/PageHeader";
import { ExperienceForm } from "../ExperienceForm";
import { createExperienceAndRedirect } from "../actions";

const EMPTY: ExperienceInput = {
  company: "",
  location: "",
  period: "",
  type: "FULL_TIME",
  stack: [],
  order: 0,
  translations: {
    en: { role: "", highlights: [""] },
    id: { role: "", highlights: [""] },
  },
};

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader
        title="New experience"
        breadcrumbs={[
          { label: "Experience", href: "/admin/experiences" },
          { label: "New" },
        ]}
      />
      <ExperienceForm
        initial={EMPTY}
        mode="create"
        onSubmit={createExperienceAndRedirect}
      />
    </>
  );
}
