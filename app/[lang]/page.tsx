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

const META = { en, id };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang: Language = rawLang;
  const t = META[lang];

  const title = `${t.about.role} · Dedy Priyatna`;
  const description = t.about.tagline;

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

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navigation />
      <CommandPalette />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <CaseStudy />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
