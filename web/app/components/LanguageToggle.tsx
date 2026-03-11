"use client";

import { useLocale } from "../lib/LocaleContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-2"
      role="navigation"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLocale("de")}
        aria-label="Deutsch"
        aria-current={locale === "de" ? "true" : undefined}
        className="focus:outline-none focus:ring-1 transition-opacity duration-200"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(232,221,208,0.9)",
          opacity: locale === "de" ? 1 : 0.3,
          background: "none",
          border: "none",
          cursor: locale === "de" ? "default" : "pointer",
          padding: 0,
          minHeight: "auto",
        }}
        onMouseEnter={(e) => {
          if (locale !== "de") (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
        }}
        onMouseLeave={(e) => {
          if (locale !== "de") (e.currentTarget as HTMLButtonElement).style.opacity = "0.3";
        }}
      >
        DE
      </button>

      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.65rem",
          color: "rgba(232,221,208,0.2)",
        }}
      >
        ·
      </span>

      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-label="English"
        aria-current={locale === "en" ? "true" : undefined}
        className="focus:outline-none focus:ring-1 transition-opacity duration-200"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(232,221,208,0.9)",
          opacity: locale === "en" ? 1 : 0.3,
          background: "none",
          border: "none",
          cursor: locale === "en" ? "default" : "pointer",
          padding: 0,
          minHeight: "auto",
        }}
        onMouseEnter={(e) => {
          if (locale !== "en") (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
        }}
        onMouseLeave={(e) => {
          if (locale !== "en") (e.currentTarget as HTMLButtonElement).style.opacity = "0.3";
        }}
      >
        EN
      </button>
    </div>
  );
}
