"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileInput } from "@/lib/validators";
import type { Language } from "@/i18n/config";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { Checkbox, TextArea, TextField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import {
  AiImproveButton,
  AiTranslateAllButton,
  AiTranslateButton,
} from "../_components/AiAssist";
import type { FieldType } from "../_components/aiClient";

interface ProfileFormProps {
  initial: ProfileInput;
  action: (input: ProfileInput) => Promise<void>;
}

const I18N_FIELDS = [
  { key: "role", fieldType: "profile.role" as FieldType },
  { key: "headlineLine1", fieldType: "profile.headlineLine" as FieldType },
  {
    key: "headlineHighlight",
    fieldType: "profile.headlineHighlight" as FieldType,
  },
  { key: "tagline", fieldType: "profile.tagline" as FieldType },
  { key: "description", fieldType: "profile.description" as FieldType },
] as const;

export function ProfileForm({ initial, action }: ProfileFormProps) {
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  });

  const onSubmit = async (values: ProfileInput) => {
    setError(undefined);
    setSuccess(undefined);
    try {
      await action(values);
      setSuccess("Profile updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const available = watch("available");

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormCard title="Basics" description="Your public identity.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            required
            {...register("name")}
            error={errors.name?.message}
          />
          <TextField
            label="Initials"
            required
            placeholder="DP"
            {...register("initials")}
            error={errors.initials?.message}
          />
          <TextField
            label="Email"
            required
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <TextField
            label="Phone"
            required
            {...register("phone")}
            error={errors.phone?.message}
          />
          <TextField
            label="Location"
            required
            {...register("location")}
            error={errors.location?.message}
          />
          <TextField
            label="LinkedIn URL"
            required
            {...register("linkedin")}
            error={errors.linkedin?.message}
          />
          <TextField
            label="GitHub URL"
            required
            {...register("github")}
            error={errors.github?.message}
          />
        </div>

        <Checkbox
          label="Available for new opportunities"
          description="Toggles the green/yellow status pill in the hero."
          checked={available}
          onChange={(e) =>
            setValue("available", e.target.checked, { shouldDirty: true })
          }
        />
      </FormCard>

      <FormCard
        title="Localized copy"
        description="Hero & about copy shown for each language. Use AI to polish or translate."
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Role"
                    required
                    placeholder="Engineering Lead · Full-Stack Architect"
                    {...register(`translations.${lang}.role`)}
                    error={errors.translations?.[lang]?.role?.message}
                    actions={
                      <>
                        <AiImproveButton
                          getText={() =>
                            getValues(`translations.${lang}.role`) ?? ""
                          }
                          lang={lang}
                          fieldType="profile.role"
                          onResult={(text) => applyToField(lang, "role", text)}
                        />
                        <AiTranslateButton
                          getSourceText={() =>
                            getValues(`translations.${otherLang}.role`) ?? ""
                          }
                          fromLang={otherLang}
                          toLang={lang}
                          fieldType="profile.role"
                          onResult={(text) => applyToField(lang, "role", text)}
                        />
                      </>
                    }
                  />
                  <TextField
                    label="Headline Highlight"
                    required
                    placeholder="that ships."
                    {...register(`translations.${lang}.headlineHighlight`)}
                    error={
                      errors.translations?.[lang]?.headlineHighlight?.message
                    }
                    actions={
                      <>
                        <AiImproveButton
                          getText={() =>
                            getValues(
                              `translations.${lang}.headlineHighlight`
                            ) ?? ""
                          }
                          lang={lang}
                          fieldType="profile.headlineHighlight"
                          onResult={(text) =>
                            applyToField(lang, "headlineHighlight", text)
                          }
                        />
                        <AiTranslateButton
                          getSourceText={() =>
                            getValues(
                              `translations.${otherLang}.headlineHighlight`
                            ) ?? ""
                          }
                          fromLang={otherLang}
                          toLang={lang}
                          fieldType="profile.headlineHighlight"
                          onResult={(text) =>
                            applyToField(lang, "headlineHighlight", text)
                          }
                        />
                      </>
                    }
                  />
                  <TextField
                    className="sm:col-span-2"
                    label="Headline Line"
                    required
                    placeholder="I build software"
                    {...register(`translations.${lang}.headlineLine1`)}
                    error={errors.translations?.[lang]?.headlineLine1?.message}
                    actions={
                      <>
                        <AiImproveButton
                          getText={() =>
                            getValues(
                              `translations.${lang}.headlineLine1`
                            ) ?? ""
                          }
                          lang={lang}
                          fieldType="profile.headlineLine"
                          onResult={(text) =>
                            applyToField(lang, "headlineLine1", text)
                          }
                        />
                        <AiTranslateButton
                          getSourceText={() =>
                            getValues(
                              `translations.${otherLang}.headlineLine1`
                            ) ?? ""
                          }
                          fromLang={otherLang}
                          toLang={lang}
                          fieldType="profile.headlineLine"
                          onResult={(text) =>
                            applyToField(lang, "headlineLine1", text)
                          }
                        />
                      </>
                    }
                  />
                </div>

                <TextArea
                  label="Tagline"
                  required
                  rows={2}
                  {...register(`translations.${lang}.tagline`)}
                  error={errors.translations?.[lang]?.tagline?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.tagline`) ?? ""
                        }
                        lang={lang}
                        fieldType="profile.tagline"
                        onResult={(text) =>
                          applyToField(lang, "tagline", text)
                        }
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.tagline`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="profile.tagline"
                        onResult={(text) =>
                          applyToField(lang, "tagline", text)
                        }
                      />
                    </>
                  }
                />

                <TextArea
                  label="About description"
                  required
                  rows={5}
                  {...register(`translations.${lang}.description`)}
                  error={errors.translations?.[lang]?.description?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.description`) ?? ""
                        }
                        lang={lang}
                        fieldType="profile.description"
                        onResult={(text) =>
                          applyToField(lang, "description", text)
                        }
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.description`) ??
                          ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="profile.description"
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
        isSubmitting={isSubmitting}
        success={success}
        error={error}
      />
    </form>
  );
}
