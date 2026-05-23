"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { experienceSchema, type ExperienceInput } from "@/lib/validators";
import type { Language } from "@/i18n/config";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextField, SelectField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import { TagInput } from "../_components/TagInput";
import { HighlightsInput } from "../_components/HighlightsInput";
import {
  AiButton,
  AiGenerateButton,
  AiImproveButton,
  AiTranslateButton,
} from "../_components/AiAssist";
import { aiTranslate } from "../_components/aiClient";

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
    setValue,
    getValues,
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

  const setRole = (lang: Language, text: string) =>
    setValue(`translations.${lang}.role`, text, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  const setHighlights = (lang: Language, list: string[]) =>
    setValue(`translations.${lang}.highlights`, list, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

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

      <FormCard
        title="Localized"
        description="Role and highlights per language. Use AI to draft new bullets, polish wording, or translate from the other language."
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
                  <AiButton
                    variant="solid"
                    label={`Translate everything from ${
                      otherLang === "en" ? "EN" : "ID"
                    } → ${lang === "en" ? "EN" : "ID"}`}
                    title="Translate role + every highlight from the other language"
                    run={async () => {
                      const role =
                        getValues(`translations.${otherLang}.role`) ?? "";
                      const highlights =
                        getValues(`translations.${otherLang}.highlights`) ?? [];

                      if (!role.trim() && highlights.every((h) => !h.trim())) {
                        throw new Error(
                          `Fill the ${
                            otherLang === "en" ? "EN" : "ID"
                          } version first.`
                        );
                      }

                      if (role.trim()) {
                        const tRole = await aiTranslate({
                          text: role,
                          fromLang: otherLang,
                          toLang: lang,
                          fieldType: "experience.role",
                        });
                        setRole(lang, tRole);
                      }

                      const translatedHighlights: string[] = [];
                      for (const h of highlights) {
                        if (!h.trim()) {
                          translatedHighlights.push(h);
                          continue;
                        }
                        const tH = await aiTranslate({
                          text: h,
                          fromLang: otherLang,
                          toLang: lang,
                          fieldType: "experience.highlight",
                        });
                        translatedHighlights.push(tH);
                      }
                      setHighlights(lang, translatedHighlights);

                      return `Translated ${
                        translatedHighlights.length + (role ? 1 : 0)
                      } field(s).`;
                    }}
                    onResult={() => {}}
                  />
                </div>

                <TextField
                  label="Role / Job title"
                  required
                  {...register(`translations.${lang}.role`)}
                  error={errors.translations?.[lang]?.role?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.role`) ?? ""
                        }
                        lang={lang}
                        fieldType="experience.role"
                        onResult={(text) => setRole(lang, text)}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.role`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="experience.role"
                        onResult={(text) => setRole(lang, text)}
                      />
                    </>
                  }
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
                      toolbar={
                        <AiGenerateButton
                          label="Suggest new bullet"
                          getContext={() => ({
                            role: getValues(`translations.${lang}.role`),
                            company: getValues("company"),
                            stack: getValues("stack"),
                            existing_highlights:
                              getValues(`translations.${lang}.highlights`) ??
                              [],
                          })}
                          lang={lang}
                          fieldType="experience.highlight"
                          onResult={(text) => {
                            const current =
                              getValues(`translations.${lang}.highlights`) ??
                              [];
                            field.onChange([...current, text]);
                          }}
                          requireKeys={["role", "company"]}
                        />
                      }
                      renderRowActions={({ value, onChange }) => (
                        <AiImproveButton
                          getText={() => value}
                          lang={lang}
                          fieldType="experience.highlight"
                          onResult={onChange}
                        />
                      )}
                    />
                  )}
                />
              </>
            );
          }}
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
