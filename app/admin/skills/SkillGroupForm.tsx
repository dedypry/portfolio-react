"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { skillGroupSchema, type SkillGroupInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";

interface Props {
  initial: SkillGroupInput;
  mode: "create" | "edit";
  onSubmit: (input: SkillGroupInput) => Promise<void>;
}

export function SkillGroupForm({ initial, mode, onSubmit }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillGroupInput>({
    resolver: zodResolver(skillGroupSchema),
    defaultValues: initial,
  });

  const submit = async (values: SkillGroupInput) => {
    setError(undefined);
    setSuccess(undefined);
    try {
      await onSubmit(values);
      setSuccess(mode === "create" ? "Created!" : "Saved.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <FormCard title="Group">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Key"
            required
            placeholder="languages"
            hint="lowercase, hyphenated. Used as the stable identifier."
            {...register("key")}
            error={errors.key?.message}
          />
          <TextField
            label="Order"
            type="number"
            hint="Lower = appears first."
            {...register("order", { valueAsNumber: true })}
            error={errors.order?.message}
          />
        </div>
      </FormCard>

      <FormCard title="Localized title" description="Display title per language.">
        <LocaleTabs
          render={(lang) => (
            <TextField
              label="Title"
              required
              {...register(`translations.${lang}.title`)}
              error={errors.translations?.[lang]?.title?.message}
            />
          )}
        />
      </FormCard>

      <FormActions
        cancelHref="/admin/skills"
        submitLabel={mode === "create" ? "Create group" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
