import { prisma } from "@/lib/prisma";
import type { ProfileInput } from "@/lib/validators";

import { PageHeader } from "../_components/PageHeader";
import { ProfileForm } from "./ProfileForm";
import { saveProfile } from "./actions";

export const dynamic = "force-dynamic";

const EMPTY: ProfileInput = {
  name: "",
  initials: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  available: true,
  translations: {
    en: {
      role: "",
      tagline: "",
      description: "",
      headlineLine1: "",
      headlineHighlight: "",
    },
    id: {
      role: "",
      tagline: "",
      description: "",
      headlineLine1: "",
      headlineHighlight: "",
    },
  },
};

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  const initial: ProfileInput = profile
    ? {
        name: profile.name,
        initials: profile.initials,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedin: profile.linkedin,
        github: profile.github,
        available: profile.available,
        translations: profile.translations as unknown as ProfileInput["translations"],
      }
    : EMPTY;

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Hero, about, and contact details that appear across the public site."
      />
      <ProfileForm initial={initial} action={saveProfile} />
    </>
  );
}
