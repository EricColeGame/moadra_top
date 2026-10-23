export interface SiteConfig {
  name: string;
  shortName: string;
  logoText: string;
  tagline: string;
  description: string;
  url: string;
  supportEmail: string;
  gameUrl?: string;
  heroVideoId?: string;
  social?: {
    discord?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
  locales: readonly string[];
  defaultLocale: string;
}

export const siteConfig: SiteConfig = {
  name: "Moadra Wiki",
  shortName: "Moadra",
  logoText: "M",
  tagline: "Guides, Secrets, Boss Tips & Walkthroughs",
  description: "Explore Moadra with gameplay guides, map and secret tips, ability upgrades, boss strategies, controls, and progression help for this sci-fi Metroidvania adventure.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://moadra.top",
  supportEmail: `support@${new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://moadra.top").hostname.replace(/^www\./, "")}`,
  gameUrl: "https://store.steampowered.com/app/1713730/Moadra/",
  heroVideoId: "8Qu-wSZlK8I",
  social: {
    youtube: "https://www.youtube.com/@Gloomsoft",
  },
  locales: ["en", "es", "pt", "de", "fr"],
  defaultLocale: "en",
};
