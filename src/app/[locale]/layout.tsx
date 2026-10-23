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
import en from "@/locales/en.json";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moadra.top";
type Messages = typeof en;

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
  const messages = (await getMessages({ locale })) as Messages;
  const image = `${siteUrl}/images/hero.webp`;
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const title = messages.home.meta.title;
  const description = messages.home.meta.description;
  const languageAlternates = Object.fromEntries([
    ...routing.locales.map((loc) => [loc, `/${loc}`]),
    ["x-default", `/${routing.defaultLocale}`],
  ]);
  return {
    metadataBase: new URL(siteUrl),
    applicationName: messages.site.name,
    title: { default: title, template: "%s" },
    description,
    manifest: "/manifest.json",
    robots: { index: true, follow: true },
    alternates: { canonical: `/${locale}`, languages: languageAlternates },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: messages.site.name },
    formatDetection: { telephone: false },
    openGraph: { type: "website", locale, url: `${siteUrl}/${locale}`, siteName: messages.site.name, title, description, images: [{ url: image, width: 1920, height: 1080, alt: `${messages.site.name} key art` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(adsenseId ? { other: { "google-adsense-account": adsenseId } } : {}),
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({ locale });
  const typedMessages = messages as Messages;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: typedMessages.site.name,
    url: siteUrl,
    description: typedMessages.site.description,
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
