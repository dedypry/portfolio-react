"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileInput } from "@/lib/validators";

import { FormCard } from "../_components/FormCard";
import { FormActions } from "../_components/FormActions";
import { Checkbox, TextArea, TextField } from "../_components/FormField";
import { LocaleTabs } from "../_components/LocaleTabs";

interface ProfileFormProps {
  initial: ProfileInput;
  action: (input: ProfileInput) => Promise<void>;
}

export function ProfileForm({ initial, action }: ProfileFormProps) {
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
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
        description="Hero & about copy shown for each language."
      >
        <LocaleTabs
          render={(lang) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Role"
                  required
                  placeholder="Engineering Lead · Full-Stack Architect"
                  {...register(`translations.${lang}.role`)}
                  error={errors.translations?.[lang]?.role?.message}
                />
                <TextField
                  label="Headline Highlight"
                  required
                  placeholder="that ships."
                  {...register(`translations.${lang}.headlineHighlight`)}
                  error={errors.translations?.[lang]?.headlineHighlight?.message}
                />
                <TextField
                  className="sm:col-span-2"
                  label="Headline Line"
                  required
                  placeholder="I build software"
                  {...register(`translations.${lang}.headlineLine1`)}
                  error={errors.translations?.[lang]?.headlineLine1?.message}
                />
              </div>

              <TextArea
                label="Tagline"
                required
                rows={2}
                {...register(`translations.${lang}.tagline`)}
                error={errors.translations?.[lang]?.tagline?.message}
              />

              <TextArea
                label="About description"
                required
                rows={5}
                {...register(`translations.${lang}.description`)}
                error={errors.translations?.[lang]?.description?.message}
              />
            </>
          )}
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
