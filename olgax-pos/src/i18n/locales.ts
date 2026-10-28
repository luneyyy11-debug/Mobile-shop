export const SUPPORTED_LOCALES = ["en", "ar", "ckb"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string | undefined): value is Locale {
  return value !== undefined && SUPPORTED_LOCALES.some((locale) => locale === value);
}
