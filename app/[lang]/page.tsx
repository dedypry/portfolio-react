import type { Metadata } from "next";
import { notFound } from "next/navigation";
import About from "@/components/About";
import CaseStudy from "@/components/CaseStudy";
import ChatBubble from "@/components/chat/ChatBubble";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import ScrollProgress from "@/components/ScrollProgress";
import Skills from "@/components/Skills";
import { en } from "@/i18n/locales/en";
import { id } from "@/i18n/locales/id";
import { isLanguage, type Language } from "@/i18n/config";
import {
  getEducation,
  getExperiences,
  getProfile,
  getProjects,
  getSkillGroups,
} from "@/lib/queries";

const META = { en, id };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang: Language = rawLang;
  const t = META[lang];

  const profile = await getProfile(lang);
  const title = `${profile.role} · ${profile.name}`;
  const description = profile.tagline || t.about.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: lang === "id" ? "id_ID" : "en_US",
      url: `/${lang}`,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) notFound();
  const lang: Language = rawLang;

  const [profile, experiences, projects, education, skillGroups] = await Promise.all([
    getProfile(lang),
    getExperiences(lang),
    getProjects(lang),
    getEducation(lang),
    getSkillGroups(lang),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navigation />
      <CommandPalette />
      <main>
        <Hero profile={profile} />
        <About />
        <Experience items={experiences} />
        <Projects items={projects} />
        <CaseStudy />
        <Skills groups={skillGroups} education={education} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
      <ChatBubble />
    </div>
  );
}
