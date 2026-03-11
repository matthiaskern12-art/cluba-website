export type Locale = "de" | "en";

export const defaultLocale: Locale = "de";
export const supportedLocales: Locale[] = ["de", "en"];

/* ─── Shared data types (re-exported for use in page.tsx) ─────────────────── */

export type HeatRange = {
  min: number;
  max: number;
  descriptor: string;
};

export type Chili = {
  name: string;
  region: string;
  country: string;
  species: string;
  harvestYear: string;
  notes: [string, string, string];
  use: string;
  drying: string;
  heat: HeatRange;
  archiveNo?: string;
  available?: boolean;
  image: string;
};

export type OriginEntry = {
  id: string;
  chili: string;
  region: string;
  elevation: string;
  archiveNo: string;
  fieldNote: string;
  imagePath: string;
  imageAlt: string;
  objectPosition: string;
  accentColor: string;
};

export type ProcessEntry = {
  method: string;
  mark: string;
  description: string;
};

/* ─── Full translation shape ─────────────────────────────────────────────── */

export type Translations = {
  meta: { title: string; description: string };
  skipLink: string;
  nav: {
    collection: string;
    process: string;
    reserve: string;
    langToggle: string;
  };
  hero: {
    tagline: string;
    archiveNumbers: string;
    archiveAriaLabel: string;
  };
  waitlistEarned: {
    label: string;
    headline: string;
    body: string;
    placeholder: string;
    button: string;
    finePrint: string;
    success: string;
  };
  collection: {
    heading: string;
    subheading: string;
    available: string;
    imageAltSuffix: string;
  };
  chilies: Chili[];
  carousel: { prev: string; next: string };
  modal: {
    label: string;
    archiveNoLabel: string;
    speciesLabel: string;
    harvestLabel: string;
    heatLabel: string;
    successTitle: string;
    successBody: string;
    formIntro: string;
    placeholder: string;
    button: string;
  };
  origins: OriginEntry[];
  processes: ProcessEntry[];
  processHeading: string;
  kitchen: { label: string; body: string; quote: string };
  close: {
    heading: string;
    packaging: string;
    newsletterLabel: string;
    placeholder: string;
    button: string;
    success: string;
    colophon: string;
    tagline: string;
  };
};

/* ─── Locale detection ───────────────────────────────────────────────────── */

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const preferred = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
  if (supportedLocales.includes(preferred as Locale)) return preferred as Locale;
  return "en";
}
