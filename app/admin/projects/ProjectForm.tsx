"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import {
  TextField,
  TextArea,
  SelectField,
  Checkbox,
} from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import { TagInput } from "../_components/TagInput";
import { ImageUpload } from "../_components/ImageUpload";

interface ProjectFormProps {
  initial: ProjectInput;
  mode: "create" | "edit";
  onSubmit: (input: ProjectInput) => Promise<void>;
}

export function ProjectForm({ initial, mode, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial,
  });

  const featured = watch("featured");

  const submit = async (values: ProjectInput) => {
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
      <FormCard title="Project">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Category"
            required
            {...register("category")}
            options={[
              { value: "Web", label: "Web" },
              { value: "Mobile", label: "Mobile" },
              { value: "Backend", label: "Backend" },
              { value: "Landing", label: "Landing" },
            ]}
          />
          <TextField
            label="Link"
            placeholder="https://example.com"
            {...register("link")}
            error={errors.link?.message}
          />
          <TextField
            label="Accent color"
            placeholder="violet | cyan | emerald | amber | rose | #hex"
            {...register("accent")}
            error={errors.accent?.message}
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

        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <ImageUpload
              label="Cover image"
              value={field.value || null}
              onChange={(url) => field.onChange(url ?? "")}
            />
          )}
        />

        <Checkbox
          label="Feature on homepage"
          description="Featured projects appear in the hero/spotlight."
          checked={featured}
          onChange={(e) =>
            setValue("featured", e.target.checked, { shouldDirty: true })
          }
        />
      </FormCard>

      <FormCard title="Localized" description="Name, tagline, description per language.">
        <LocaleTabs
          render={(lang) => (
            <>
              <TextField
                label="Name"
                required
                {...register(`translations.${lang}.name`)}
                error={errors.translations?.[lang]?.name?.message}
              />
              <TextField
                label="Tagline"
                required
                {...register(`translations.${lang}.tagline`)}
                error={errors.translations?.[lang]?.tagline?.message}
              />
              <TextArea
                label="Description"
                rows={4}
                required
                {...register(`translations.${lang}.description`)}
                error={errors.translations?.[lang]?.description?.message}
              />
            </>
          )}
        />
      </FormCard>

      <FormActions
        cancelHref="/admin/projects"
        submitLabel={mode === "create" ? "Create" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
