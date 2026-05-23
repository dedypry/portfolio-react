import type { EducationInput } from "@/lib/validators";

import { PageHeader } from "../../_components/PageHeader";
import { EducationForm } from "../EducationForm";
import { createEducationAndRedirect } from "../actions";

const EMPTY: EducationInput = {
  school: "",
  location: "",
  period: "",
  order: 0,
  translations: {
    en: { degree: "", description: "" },
    id: { degree: "", description: "" },
  },
};

export default function NewEducationPage() {
  return (
    <>
      <PageHeader
        title="New education entry"
        breadcrumbs={[
          { label: "Education", href: "/admin/education" },
          { label: "New" },
        ]}
      />
      <EducationForm
        initial={EMPTY}
        mode="create"
        onSubmit={createEducationAndRedirect}
      />
    </>
  );
}
