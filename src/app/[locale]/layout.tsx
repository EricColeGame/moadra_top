import { siteConfig } from "@/config/site";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moadra.top";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#722bca",
  colorScheme: "dark light",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const title = "Moadra Wiki - Guides, Secrets & Boss Tips";
  const description = "Explore Moadra with gameplay guides, map and secret tips, ability upgrades, boss strategies, controls, and progression help for this sci-fi Metroidvania adventure.";
  return {
    metadataBase: new URL(siteUrl),
    applicationName: "Moadra Wiki",
    title: { default: title, template: "%s" },
    description,
    manifest: "/manifest.json",
    robots: { index: true, follow: true },
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(routing.locales.map((loc) => [loc, `/${loc}`])) },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Moadra Wiki" },
    formatDetection: { telephone: false },
    openGraph: { type: "website", locale, url: `${siteUrl}/${locale}`, siteName: siteConfig.name, title, description, images: [{ url: image, width: 1920, height: 1080, alt: "Moadra Wiki key art" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(adsenseId ? { other: { "google-adsense-account": adsenseId } } : {}),
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({ locale });
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    logo: { "@type": "ImageObject", url: `${siteUrl}/android-chrome-512x512.png`, width: 512, height: 512 },
    image: { "@type": "ImageObject", url: `${siteUrl}/images/hero.webp`, width: 1920, height: 1080 },
    sameAs: [siteConfig.social?.youtube, siteConfig.social?.discord].filter(Boolean),
  };

  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {adsenseId && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
