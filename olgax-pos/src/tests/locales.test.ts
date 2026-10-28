import { describe, expect, it } from "vitest";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/i18n/locales";

describe("supported locales", () => {
  it("supports Sorani Kurdish for RTL UI", () => {
    expect(SUPPORTED_LOCALES).toContain("ckb");
    expect(isSupportedLocale("ckb")).toBe(true);
  });

  it("rejects a removed locale", () => {
    expect(SUPPORTED_LOCALES).not.toContain("es");
    expect(isSupportedLocale("es")).toBe(false);
  });

  it("rejects unknown and missing locale values", () => {
    expect(isSupportedLocale("unknown")).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
  });
});
