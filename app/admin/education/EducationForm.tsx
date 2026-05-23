"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { educationSchema, type EducationInput } from "@/lib/validators";
import type { Language } from "@/i18n/config";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextField, TextArea } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import {
  AiGenerateButton,
  AiImproveButton,
  AiTranslateAllButton,
  AiTranslateButton,
} from "../_components/AiAssist";
import type { FieldType } from "../_components/aiClient";

interface EducationFormProps {
  initial: EducationInput;
  mode: "create" | "edit";
  onSubmit: (input: EducationInput) => Promise<void>;
}

const I18N_FIELDS = [
  { key: "degree", fieldType: "education.degree" as FieldType },
  { key: "description", fieldType: "education.description" as FieldType },
] as const;

export function EducationForm({ initial, mode, onSubmit }: EducationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
          render={(lang) => {
            const otherLang: Language = lang === "en" ? "id" : "en";

            return (
              <>
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
                  label="Degree"
                  required
                  placeholder="Bachelor's Degree, Computer Science"
                  {...register(`translations.${lang}.degree`)}
                  error={errors.translations?.[lang]?.degree?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.degree`) ?? ""
                        }
                        lang={lang}
                        fieldType="education.degree"
                        onResult={(text) => applyToField(lang, "degree", text)}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.degree`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="education.degree"
                        onResult={(text) => applyToField(lang, "degree", text)}
                      />
                    </>
                  }
                />

                <TextArea
                  label="Description"
                  rows={3}
                  {...register(`translations.${lang}.description`)}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.description`) ?? ""
                        }
                        lang={lang}
                        fieldType="education.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                      />
                      <AiGenerateButton
                        label="From degree + school"
                        getContext={() => ({
                          degree: getValues(`translations.${lang}.degree`),
                          school: getValues("school"),
                          period: getValues("period"),
                        })}
                        lang={lang}
                        fieldType="education.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                        requireKeys={["degree", "school"]}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.description`) ??
                          ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="education.description"
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
        cancelHref="/admin/education"
        submitLabel={mode === "create" ? "Create" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
