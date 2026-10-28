"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.email({ email: email.trim(), password });

      if (result.error) {
        console.error("[login error]", result.error);
        setError(
          result.error.code === "INVALID_EMAIL_OR_PASSWORD" || result.error.status === 401
            ? t("invalidCredentials")
            : t("signInError")
        );
        return;
      }

      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const destination = callbackUrl
        ? new URL(callbackUrl, window.location.origin)
        : new URL("/pos", window.location.origin);
      const nextPath =
        destination.origin === window.location.origin
          ? `${destination.pathname}${destination.search}${destination.hash}`
          : "/pos";
      window.location.assign(nextPath);
    } catch (err) {
      console.error("[login request error]", err);
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#0f2044] focus:bg-white focus:ring-2 focus:ring-[#0f2044]/10 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50 px-4">
      {/* Soft decorative blob */}
      <div
        className="pointer-events-none fixed top-0 right-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #0f2044 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #f5c518 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="space-y-7 rounded-3xl border border-gray-100 bg-white px-8 py-10 shadow-xl shadow-gray-200/80">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/android-chrome-192x192.png"
              alt="Mobile Shop POS"
              className="h-16 w-16 rounded-2xl shadow-md shadow-gray-200"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f2044]">Mobile Shop POS</h1>
              <p className="mt-0.5 text-sm text-gray-500">{t("subtitle")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#f5c518] px-4 py-2 text-sm font-bold text-[#0f2044] shadow-md shadow-[#f5c518]/30 transition-all hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-[#f5c518] focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Mobile Shop POS — based on Olgax POS (MIT)
        </p>
      </div>
    </div>
  );
}
