"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import { blogSchema, type BlogInput } from "@/lib/validators";
import type { Language } from "@/i18n/config";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextArea, TextField, SelectField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import { Editor } from "../_components/Editor";
import { ImageUpload } from "../_components/ImageUpload";
import { TagInput } from "../_components/TagInput";
import {
  AiGenerateButton,
  AiImproveButton,
  AiTranslateAllButton,
  AiTranslateButton,
} from "../_components/AiAssist";
import type { FieldType } from "../_components/aiClient";

interface BlogFormProps {
  initial: BlogInput;
  mode: "create" | "edit";
  onSubmit: (input: BlogInput) => Promise<void>;
}

const toSlug = (text: string) =>
  slugify(text, { lower: true, strict: true, trim: true });

const I18N_FIELDS = [
  { key: "title", fieldType: "blog.title" as FieldType },
  { key: "excerpt", fieldType: "blog.excerpt" as FieldType },
  { key: "content", fieldType: "blog.content" as FieldType },
] as const;

export function BlogForm({ initial, mode, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: initial,
  });

  const titleEn = watch("translations.en.title");

  useEffect(() => {
    if (!autoSlug) return;
    const next = titleEn ? toSlug(titleEn) : "";
    setValue("slug", next, { shouldDirty: true, shouldValidate: false });
  }, [titleEn, autoSlug, setValue]);

  const slugReg = register("slug");

  const handleResetAutoSlug = () => {
    setAutoSlug(true);
    if (titleEn) {
      setValue("slug", toSlug(titleEn), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  /** Apply AI output to a translations.<lang>.<key> field. */
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

  const submit = async (values: BlogInput) => {
    setError(undefined);
    setSuccess(undefined);
    try {
      await onSubmit(values);
      setSuccess(mode === "create" ? "Created!" : "Saved.");
      if (mode === "create") {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <FormCard title="Meta" description="URL, status, and discoverability.">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TextField
              label="Slug"
              required
              {...slugReg}
              onChange={(e) => {
                if (autoSlug) setAutoSlug(false);
                slugReg.onChange(e);
              }}
              error={errors.slug?.message}
              hint={
                autoSlug
                  ? "Auto-generated from the English title."
                  : "lowercase, hyphenated. Used in the URL."
              }
            />
            <button
              type="button"
              onClick={handleResetAutoSlug}
              className="mt-1 text-xs text-indigo-300 hover:text-indigo-200 disabled:opacity-50"
              disabled={autoSlug}
            >
              {autoSlug ? "Auto-syncing with title…" : "Reset to auto from title"}
            </button>
          </div>

          <SelectField
            label="Status"
            {...register("status")}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
          />
        </div>

        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              label="Tags"
              value={field.value ?? []}
              onChange={field.onChange}
              hint="Press Enter to add. e.g. nextjs, prisma."
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
              hint="Recommended 1200×630 or similar 16:9."
            />
          )}
        />
      </FormCard>

      <FormCard
        title="Content"
        description="Title, excerpt, and body for each language. Use the AI buttons to draft, polish, or translate."
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
                  label="Title"
                  required
                  placeholder="The headline visitors see"
                  {...register(`translations.${lang}.title`)}
                  error={errors.translations?.[lang]?.title?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.title`) ?? ""
                        }
                        lang={lang}
                        fieldType="blog.title"
                        onResult={(text) => applyToField(lang, "title", text)}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.title`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="blog.title"
                        onResult={(text) => applyToField(lang, "title", text)}
                      />
                    </>
                  }
                />

                <TextArea
                  label="Excerpt"
                  rows={3}
                  required
                  placeholder="One-paragraph summary shown on the blog list."
                  {...register(`translations.${lang}.excerpt`)}
                  error={errors.translations?.[lang]?.excerpt?.message}
                  actions={
                    <>
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.excerpt`) ?? ""
                        }
                        lang={lang}
                        fieldType="blog.excerpt"
                        onResult={(text) =>
                          applyToField(lang, "excerpt", text)
                        }
                      />
                      <AiGenerateButton
                        label="From title"
                        getContext={() => ({
                          title: getValues(`translations.${lang}.title`),
                          tags: getValues("tags"),
                        })}
                        lang={lang}
                        fieldType="blog.excerpt"
                        onResult={(text) =>
                          applyToField(lang, "excerpt", text)
                        }
                        requireKeys={["title"]}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.excerpt`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="blog.excerpt"
                        onResult={(text) =>
                          applyToField(lang, "excerpt", text)
                        }
                      />
                    </>
                  }
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                      Body <span className="text-rose-400">*</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <AiImproveButton
                        getText={() =>
                          getValues(`translations.${lang}.content`) ?? ""
                        }
                        lang={lang}
                        fieldType="blog.content"
                        onResult={(text) =>
                          applyToField(lang, "content", text)
                        }
                      />
                      <AiGenerateButton
                        label="Draft from title + excerpt"
                        getContext={() => ({
                          title: getValues(`translations.${lang}.title`),
                          excerpt: getValues(`translations.${lang}.excerpt`),
                          tags: getValues("tags"),
                        })}
                        lang={lang}
                        fieldType="blog.content"
                        onResult={(text) =>
                          applyToField(lang, "content", text)
                        }
                        requireKeys={["title", "excerpt"]}
                      />
                      <AiTranslateButton
                        getSourceText={() =>
                          getValues(`translations.${otherLang}.content`) ?? ""
                        }
                        fromLang={otherLang}
                        toLang={lang}
                        fieldType="blog.content"
                        onResult={(text) =>
                          applyToField(lang, "content", text)
                        }
                      />
                    </span>
                  </div>
                  <Controller
                    control={control}
                    name={`translations.${lang}.content`}
                    render={({ field }) => (
                      <Editor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Start writing…"
                      />
                    )}
                  />
                  {errors.translations?.[lang]?.content && (
                    <p className="text-xs text-rose-400">
                      {errors.translations[lang]?.content?.message}
                    </p>
                  )}
                </div>
              </>
            );
          }}
        />
      </FormCard>

      <FormActions
        cancelHref="/admin/blogs"
        submitLabel={mode === "create" ? "Create post" : "Save changes"}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
      />
    </form>
  );
}
