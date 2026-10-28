"use server";

import { cookies } from "next/headers";
import { isSupportedLocale } from "@/i18n/locales";

export async function setLocale(locale: string) {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  const cookieStore = await cookies();
  cookieStore.set("olgax_locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
