import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { isSupportedLocale, type Locale } from "./locales";

export default getRequestConfig(async () => {
  // Try cookie first (fast path — no DB needed on most requests)
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("olgax_locale")?.value;
  if (isSupportedLocale(cookieLocale)) {
    const messages = (await import(`../../messages/${cookieLocale}.json`)).default;
    return { locale: cookieLocale, messages };
  }

  // Fallback: read from DB business settings
  let locale: Locale = "en";
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "singleton" },
      select: { language: true },
    });
    const lang = settings?.language ?? "en";
    if (isSupportedLocale(lang)) locale = lang;
  } catch {
    // DB not available — use English
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
