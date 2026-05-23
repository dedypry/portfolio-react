"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import { blogSchema, type BlogInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { TextArea, TextField, SelectField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";
import { Editor } from "../_components/Editor";
import { ImageUpload } from "../_components/ImageUpload";
import { TagInput } from "../_components/TagInput";

interface BlogFormProps {
  initial: BlogInput;
  mode: "create" | "edit";
  onSubmit: (input: BlogInput) => Promise<void>;
}

export function BlogForm({ initial, mode, onSubmit }: BlogFormProps) {
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
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: initial,
  });

  const titleEn = watch("translations.en.title");

  const handleAutoSlug = () => {
    if (!titleEn) return;
    const slug = slugify(titleEn, { lower: true, strict: true });
    setValue("slug", slug, { shouldDirty: true, shouldValidate: true });
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
              {...register("slug")}
              error={errors.slug?.message}
              hint="lowercase, hyphenated. Used in the URL."
            />
            <button
              type="button"
              onClick={handleAutoSlug}
              className="mt-1 text-xs text-indigo-300 hover:text-indigo-200"
            >
              Auto-generate from English title
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
        description="Title, excerpt, and body for each language."
      >
        <LocaleTabs
          render={(lang) => (
            <>
              <TextField
                label="Title"
                required
                placeholder="The headline visitors see"
                {...register(`translations.${lang}.title`)}
                error={errors.translations?.[lang]?.title?.message}
              />
              <TextArea
                label="Excerpt"
                rows={3}
                required
                placeholder="One-paragraph summary shown on the blog list."
                {...register(`translations.${lang}.excerpt`)}
                error={errors.translations?.[lang]?.excerpt?.message}
              />

              <div className="space-y-1.5">
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Body <span className="text-rose-400">*</span>
                </span>
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
          )}
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
