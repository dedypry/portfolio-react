import type { SkillGroupInput } from "@/lib/validators";

import { PageHeader } from "../../_components/PageHeader";
import { SkillGroupForm } from "../SkillGroupForm";
import { createSkillGroupAndRedirect } from "../actions";

const EMPTY: SkillGroupInput = {
  key: "",
  order: 0,
  translations: {
    en: { title: "" },
    id: { title: "" },
  },
};

export default function NewSkillGroupPage() {
  return (
    <>
      <PageHeader
        title="New skill group"
        breadcrumbs={[
          { label: "Skills", href: "/admin/skills" },
          { label: "New group" },
        ]}
      />
      <SkillGroupForm
        initial={EMPTY}
        mode="create"
        onSubmit={createSkillGroupAndRedirect}
      />
    </>
  );
}
