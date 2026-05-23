import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { isLanguage, type Language } from "@/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dedypry.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dedy Priyatna · Engineering Lead & Full-Stack Architect",
    template: "%s · Dedy Priyatna",
  },
  description:
    "Lead E-commerce Engineer & Full-Stack Architect crafting scalable, human-centered software since 2019.",
  applicationName: "Dedy Priyatna · Portfolio",
  authors: [{ name: "Dedy Priyatna" }],
  creator: "Dedy Priyatna",
  keywords: [
    "Dedy Priyatna",
    "Full-Stack Engineer",
    "Engineering Lead",
    "E-commerce",
    "TypeScript",
    "Node.js",
    "React",
    "Next.js",
  ],
  openGraph: {
    type: "website",
    siteName: "Dedy Priyatna",
    url: SITE_URL,
    title: "Dedy Priyatna · Engineering Lead & Full-Stack Architect",
    description:
      "Crafting scalable, human-centered software. Lead E-commerce @ PT. Vigo Technologi Indonesia.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dedy Priyatna · Engineering Lead & Full-Stack Architect",
    description:
      "Building scalable products, resilient teams, and software that ships.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      id: "/id",
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8ff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware sets the x-locale header so we know the locale for <html lang>.
  const headersList = await headers();
  const headerLocale = headersList.get("x-locale");
  const lang: Language = isLanguage(headerLocale) ? headerLocale : "en";

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body className="theme-dark min-h-screen bg-ink-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
