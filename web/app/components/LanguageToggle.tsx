"use client";

import { useLocale } from "../lib/LocaleContext";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "de" ? "en" : "de")}
      aria-label={
        locale === "de" ? "Switch to English" : "Zu Deutsch wechseln"
      }
      className="transition-opacity hover:opacity-100 focus:outline-none focus:ring-1"
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(232,221,208,0.55)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        minHeight: "auto",
      }}
    >
      {t.nav.langToggle}
    </button>
  );
}
