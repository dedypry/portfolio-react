import { notFound } from "next/navigation";
import Providers from "@/components/Providers";
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from "@/i18n/config";

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) notFound();
  const lang: Language = rawLang;

  return <Providers lang={lang}>{children}</Providers>;
}
