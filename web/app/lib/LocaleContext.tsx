"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  type Locale,
  type Translations,
  defaultLocale,
  supportedLocales,
  detectLocale,
} from "./i18n";
import de from "../locales/de";
import en from "../locales/en";

const localeMap: Record<Locale, Translations> = { de, en };

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check localStorage (user has manually chosen)
    const saved = localStorage.getItem("cluba-locale") as Locale | null;
    if (saved && supportedLocales.includes(saved)) {
      setLocaleState(saved);
    } else {
      // 2. Detect browser language — fallback to EN if neither DE nor EN
      const detected = detectLocale(navigator.language);
      setLocaleState(detected);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem("cluba-locale", newLocale);
    setLocaleState(newLocale);
  };

  // Before mount, render with default locale to avoid layout shift
  const t = localeMap[mounted ? locale : defaultLocale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
