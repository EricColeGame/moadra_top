import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shared" });

  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-border bg-card/70 p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t("pageNotFoundTitle")}</h1>
        <p className="mt-4 text-muted-foreground">{t("pageNotFoundDescription")}</p>
        <Button asChild className="mt-6"><Link href={`/${locale}/combat`}>{t("browseCombatGuides")}</Link></Button>
      </div>
    </main>
  );
}
