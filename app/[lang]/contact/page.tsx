import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { isLanguage, type Language } from "@/i18n/config";
import { en as enLocale } from "@/i18n/locales/en";
import { id as idLocale } from "@/i18n/locales/id";
import { getProfile } from "@/lib/queries";

import { MessageForm } from "./_components/MessageForm";

export const dynamic = "force-dynamic";

const LOCALE = { en: enLocale, id: idLocale };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang: Language = rawLang;
  const t = LOCALE[lang];

  return {
    title: t.message.title,
    description: t.message.description,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { en: "/en/contact", id: "/id/contact" },
    },
    openGraph: {
      title: t.message.title,
      description: t.message.description,
      type: "website",
      url: `/${lang}/contact`,
    },
  };
}

export default async function ContactMessagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) notFound();
  const lang: Language = rawLang;
  const t = LOCALE[lang];

  const profile = await getProfile(lang);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navigation />

      <main className="container-x pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${lang}#contact`}
            className="group mb-8 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition group-hover:-translate-x-0.5"
            />
            {t.contact.eyebrow}
          </Link>

          <header className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-soft">
              {t.message.eyebrow}
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t.message.title}
            </h1>
            <p className="mt-4 text-lg text-white/70">{t.message.description}</p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <MessageForm
              lang={lang}
              labels={{
                nameLabel: t.message.nameLabel,
                namePlaceholder: t.message.namePlaceholder,
                emailLabel: t.message.emailLabel,
                emailPlaceholder: t.message.emailPlaceholder,
                subjectLabel: t.message.subjectLabel,
                subjectPlaceholder: t.message.subjectPlaceholder,
                bodyLabel: t.message.bodyLabel,
                bodyPlaceholder: t.message.bodyPlaceholder,
                submit: t.message.submit,
                submitting: t.message.submitting,
                successTitle: t.message.successTitle,
                successBody: t.message.successBody,
                sendAnother: t.message.sendAnother,
                backHome: t.message.backHome,
                privacyNote: t.message.privacyNote,
                failed: t.message.failed,
              }}
            />

            <aside className="space-y-4">
              <div className="glass rounded-3xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/55">
                  {t.contact.cardTitle}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {t.contact.cardDescription}
                </p>

                <div className="mt-5 grid gap-3 text-sm">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 text-white/85 hover:text-white"
                  >
                    <Mail
                      size={15}
                      className="text-accent-soft"
                      aria-hidden
                    />
                    <span className="break-all">{profile.email}</span>
                  </a>
                  <a
                    href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                    className="group flex items-center gap-3 text-white/85 hover:text-white"
                  >
                    <Phone
                      size={15}
                      className="text-accent-soft"
                      aria-hidden
                    />
                    {profile.phone}
                  </a>
                  <div className="flex items-center gap-3 text-white/85">
                    <MapPin
                      size={15}
                      className="text-accent-soft"
                      aria-hidden
                    />
                    {profile.location}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-200/90">
                <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                {t.contact.statusOpen}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer name={profile.name} />
    </div>
  );
}
