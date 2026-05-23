"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { experienceSchema, type ExperienceInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextField, SelectField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import { TagInput } from "../_components/TagInput";
import { HighlightsInput } from "../_components/HighlightsInput";

interface ExperienceFormProps {
  initial: ExperienceInput;
  mode: "create" | "edit";
  onSubmit: (input: ExperienceInput) => Promise<void>;
}

export function ExperienceForm({ initial, mode, onSubmit }: ExperienceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initial,
  });

  const submit = async (values: ExperienceInput) => {
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
      <FormCard title="Position">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Company"
            required
            {...register("company")}
            error={errors.company?.message}
          />
          <TextField
            label="Location"
            required
            {...register("location")}
            error={errors.location?.message}
          />
          <TextField
            label="Period"
            required
            placeholder="Mar 2024 — Present"
            {...register("period")}
            error={errors.period?.message}
          />
          <SelectField
            label="Type"
            required
            {...register("type")}
            options={[
              { value: "FULL_TIME", label: "Full-time" },
              { value: "CONTRACT", label: "Contract" },
              { value: "FREELANCE", label: "Freelance" },
              { value: "INTERNSHIP", label: "Internship" },
            ]}
          />
          <TextField
            label="Order"
            type="number"
            hint="Lower = appears first."
            {...register("order", { valueAsNumber: true })}
            error={errors.order?.message}
          />
        </div>

        <Controller
          control={control}
          name="stack"
          render={({ field }) => (
            <TagInput
              label="Stack"
              value={field.value ?? []}
              onChange={field.onChange}
              hint="Press Enter to add."
            />
          )}
        />
      </FormCard>

      <FormCard title="Localized" description="Role and highlights per language.">
        <LocaleTabs
          render={(lang) => (
            <>
              <TextField
                label="Role / Job title"
                required
                {...register(`translations.${lang}.role`)}
                error={errors.translations?.[lang]?.role?.message}
              />
              <Controller
                control={control}
                name={`translations.${lang}.highlights`}
                render={({ field }) => (
                  <HighlightsInput
                    label="Highlights"
                    value={field.value ?? []}
                    onChange={field.onChange}
                    error={errors.translations?.[lang]?.highlights?.message}
                  />
                )}
              />
            </>
          )}
        />
      </FormCard>

      <FormActions
        cancelHref="/admin/experiences"
        submitLabel={mode === "create" ? "Create" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
