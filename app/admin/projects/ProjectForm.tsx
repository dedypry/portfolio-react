"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectInput } from "@/lib/validators";
import type { Language } from "@/i18n/config";

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
import {
  AiGenerateButton,
  AiImproveButton,
  AiTranslateAllButton,
  AiTranslateButton,
} from "../_components/AiAssist";
import type { FieldType } from "../_components/aiClient";

interface ProjectFormProps {
  initial: ProjectInput;
  mode: "create" | "edit";
  onSubmit: (input: ProjectInput) => Promise<void>;
}

/** Per-locale fields the AI buttons operate on. */
const I18N_FIELDS = [
  { key: "name", fieldType: "project.name" as FieldType },
  { key: "tagline", fieldType: "project.tagline" as FieldType },
  { key: "description", fieldType: "project.description" as FieldType },
] as const;

export function ProjectForm({ initial, mode, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
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

  /**
   * Apply an AI-generated string to a translations.<lang>.<key> field. Marks
   * dirty + valid so react-hook-form's submit gating updates correctly.
   */
  const applyToField = (
    lang: Language,
    key: (typeof I18N_FIELDS)[number]["key"],
    text: string
  ) => {
    setValue(`translations.${lang}.${key}`, text, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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

      <FormCard
        title="Localized"
        description="Name, tagline, description per language. Use the AI buttons to polish, generate, or translate copy with Gemini."
      >
        <LocaleTabs
          render={(lang) => {
            const otherLang: Language = lang === "en" ? "id" : "en";

            return (
              <>
                {/* Bulk translate from the other locale. */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500/5 px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wider text-indigo-300">
                    AI tools
                  </span>
                  <AiTranslateAllButton
                    getSource={() =>
                      Object.fromEntries(
                        I18N_FIELDS.map(({ key, fieldType }) => [
                          key,
                          {
                            value:
                              getValues(
                                `translations.${otherLang}.${key}`
                              ) ?? "",
                            fieldType,
                          },
                        ])
                      )
                    }
                    fromLang={otherLang}
                    toLang={lang}
                    onResult={(id, text) =>
                      applyToField(
                        lang,
                        id as (typeof I18N_FIELDS)[number]["key"],
                        text
                      )
                    }
                  />
                </div>

                <TextField
                  label="Name"
                  required
                  {...register(`translations.${lang}.name`)}
                  error={errors.translations?.[lang]?.name?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.name`) ?? ""
                        }
                        lang={lang}
                        fieldType="project.name"
                        onResult={(text) => applyToField(lang, "name", text)}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.name`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="project.name"
                        onResult={(text) => applyToField(lang, "name", text)}
                      />
                    </>
                  }
                />

                <TextField
                  label="Tagline"
                  required
                  {...register(`translations.${lang}.tagline`)}
                  error={errors.translations?.[lang]?.tagline?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.tagline`) ?? ""
                        }
                        lang={lang}
                        fieldType="project.tagline"
                        onResult={(text) => applyToField(lang, "tagline", text)}
                      />
                      <AiGenerateButton
                        label="From name"
                        getContext={() => ({
                          name: getValues(`translations.${lang}.name`),
                          stack: getValues("stack"),
                          category: getValues("category"),
                        })}
                        lang={lang}
                        fieldType="project.tagline"
                        onResult={(text) => applyToField(lang, "tagline", text)}
                        requireKeys={["name"]}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.tagline`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="project.tagline"
                        onResult={(text) => applyToField(lang, "tagline", text)}
                      />
                    </>
                  }
                />

                <TextArea
                  label="Description"
                  rows={4}
                  required
                  {...register(`translations.${lang}.description`)}
                  error={errors.translations?.[lang]?.description?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.description`) ?? ""
                        }
                        lang={lang}
                        fieldType="project.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                      />
                      <AiGenerateButton
                        label="From context"
                        getContext={() => ({
                          name: getValues(`translations.${lang}.name`),
                          tagline: getValues(`translations.${lang}.tagline`),
                          stack: getValues("stack"),
                          category: getValues("category"),
                        })}
                        lang={lang}
                        fieldType="project.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                        requireKeys={["name", "tagline"]}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.description`) ??
                          ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="project.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                      />
                    </>
                  }
                />
              </>
            );
          }}
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
