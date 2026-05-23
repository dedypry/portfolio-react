"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { educationSchema, type EducationInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextField, TextArea } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";

interface EducationFormProps {
  initial: EducationInput;
  mode: "create" | "edit";
  onSubmit: (input: EducationInput) => Promise<void>;
}

export function EducationForm({ initial, mode, onSubmit }: EducationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: initial,
  });

  const submit = async (values: EducationInput) => {
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
      <FormCard title="School">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="School"
            required
            {...register("school")}
            error={errors.school?.message}
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
            placeholder="2019 — 2022"
            {...register("period")}
            error={errors.period?.message}
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

      <FormCard
        title="Localized"
        description="Degree title and optional description per language."
      >
        <LocaleTabs
          render={(lang) => (
            <>
              <TextField
                label="Degree"
                required
                placeholder="Bachelor's Degree, Computer Science"
                {...register(`translations.${lang}.degree`)}
                error={errors.translations?.[lang]?.degree?.message}
              />
              <TextArea
                label="Description"
                rows={3}
                {...register(`translations.${lang}.description`)}
              />
            </>
          )}
        />
      </FormCard>

      <FormActions
        cancelHref="/admin/education"
        submitLabel={mode === "create" ? "Create" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
