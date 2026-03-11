"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "./hooks/useMediaQuery";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type HeatRange = { min: number; max: number; descriptor: string };

type Chili = {
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

type OriginEntry = {
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

/* ─── Data ───────────────────────────────────────────────────────────────── */

const FEATURED_CHILIES: Chili[] = [
  {
    name: "Guajillo",
    region: "Oaxaca Highlands",
    country: "Mexico",
    species: "Capsicum annuum",
    harvestYear: "2025",
    notes: ["Dried cherry", "Cocoa husk", "Black tea"],
    drying: "Sun-dried for depth and clarity.",
    use: "Sauces, broths, slow braises",
    heat: { min: 2500, max: 5000, descriptor: "Gentle warmth" },
    archiveNo: "2025–MX–OAX–GUA",
    available: true,
    image: "/images/chilies/guajillo.png",
  },
  {
    name: "Ancho",
    region: "Puebla Highlands",
    country: "Mexico",
    species: "Capsicum annuum",
    harvestYear: "2025",
    notes: ["Raisin", "Dark chocolate", "Dried plum"],
    drying: "Slow sun-drying to concentrate natural sweetness.",
    use: "Moles, stews, braised vegetables",
    heat: { min: 1000, max: 2000, descriptor: "Mild warmth" },
    archiveNo: "2025–MX–PUE–ANC",
    available: true,
    image: "/images/chilies/ancho.png",
  },
  {
    name: "Chipotle",
    region: "Sierra Norte",
    country: "Mexico",
    species: "Capsicum annuum",
    harvestYear: "2025",
    notes: ["Wood smoke", "Tamarind", "Tobacco"],
    drying: "Traditionally smoked over wood for layered aroma.",
    use: "Beans, marinades, long-cooked sauces",
    heat: { min: 2500, max: 8000, descriptor: "Steady warmth" },
    archiveNo: "2025–MX–SNO–CHP",
    image: "/images/chilies/chipotle.png",
  },
  {
    name: "Chile de Árbol",
    region: "Jalisco",
    country: "Mexico",
    species: "Capsicum annuum",
    harvestYear: "2025",
    notes: ["Bright red fruit", "Clean spice", "Structured heat"],
    drying: "Rapid sun-drying to preserve clarity.",
    use: "Salsas, chili oils, finishing heat",
    heat: { min: 15000, max: 30000, descriptor: "Direct heat" },
    archiveNo: "2025–MX–JAL–ARB",
    image: "/images/chilies/arbol.png",
  },
];

const ORIGINS: OriginEntry[] = [
  {
    id: "oaxaca",
    chili: "Guajillo",
    region: "Oaxaca Highlands",
    elevation: "1,800m",
    archiveNo: "2025–MX–OAX–GUA",
    fieldNote:
      "The guajillo hangs in clusters like dried coral. In the Oaxacan highlands, the air thins before noon and the pods take weeks to reach their final amber. What the altitude removes — moisture, softness — the fruit concentrates into something close to leather and distant from fire.",
    imagePath: "/images/chilies/landscape-oaxaca.png",
    imageAlt: "Oaxaca highlands chili fields at dusk",
    objectPosition: "center 60%",
    accentColor: "#8B3A2A",
  },
  {
    id: "puebla",
    chili: "Ancho",
    region: "Puebla Highlands",
    elevation: "2,100m",
    archiveNo: "2025–MX–PUE–ANC",
    fieldNote:
      "The ancho poblano begins as a poblano pepper — wide-shouldered, dark green, grown in the high valleys east of the volcano. Dried, it turns the color of aged mahogany and smells faintly of dried plum. The heat is low. The flavor is the point.",
    imagePath: "/images/chilies/landscape-puebla.png",
    imageAlt: "Puebla valley fields with Popocatépetl in distance",
    objectPosition: "center 40%",
    accentColor: "#5C3D1E",
  },
  {
    id: "jalisco",
    chili: "Chile de Árbol",
    region: "Jalisco",
    elevation: "1,400m",
    archiveNo: "2025–MX–JAL–ARB",
    fieldNote:
      "Chile de árbol means 'tree chili' — the plant grows woody, upright, almost defiant. In Jalisco the pods dry on the branch before harvest. They arrive small, bright red, and carrying a clean, linear heat that builds without the smokiness of their cousins from the north.",
    imagePath: "/images/chilies/landscape-jalisco.png",
    imageAlt: "Jalisco highlands with árbol chili plants",
    objectPosition: "center 50%",
    accentColor: "#7A2B1A",
  },
];

const PROCESSES = [
  {
    method: "Sun",
    mark: "○",
    description:
      "Guajillo and árbol are laid on reed mats in direct highland sun. The drying takes 10–14 days. The skin pulls tight. The sugars concentrate without intervention.",
  },
  {
    method: "Shade",
    mark: "◐",
    description:
      "The ancho dries slowly in covered sheds with open sides. Slower than sun, the texture stays supple. The flavor develops complexity that direct heat would burn away.",
  },
  {
    method: "Smoke",
    mark: "◎",
    description:
      "Chipotle is jalapeño held over pecan and mesquite smoke for days. The heat never leaves. The smoke becomes inseparable from the flesh. It arrives tasting like memory.",
  },
];

/* ─── Utilities ──────────────────────────────────────────────────────────── */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatSHURange(min: number, max: number) {
  return `${min.toLocaleString()}–${max.toLocaleString()} SHU`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);
  return { ref, inView };
}

function Reveal({
  children,
  className,
  delayMs = 0,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const options = useMemo<IntersectionObserverInit>(
    () => ({ threshold }),
    [threshold]
  );
  const { ref, inView } = useInView<HTMLDivElement>(options);
  return (
    <div
      ref={ref}
      className={cx(
        "will-change-transform",
        reduced
          ? "opacity-100"
          : "transition-[opacity,transform] duration-700 ease-out",
        reduced ? "" : inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={!reduced ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M13.5 5.5a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.4l-4.3-4.3a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/* ─── Skip Link ──────────────────────────────────────────────────────────── */

function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      Skip to content
    </a>
  );
}

/* ─── Waitlist Modal ─────────────────────────────────────────────────────── */

function WaitlistModal({ chili, onClose }: { chili: Chili; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const sel =
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(sel));
    focusable[0]?.focus();
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [submitted]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: value,
          source: "collection-modal",
          chili: chili.name,
          archiveNo: chili.archiveNo,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Waitlist failed:", (data as { error?: string }).error);
      }
    } catch (err) {
      console.error("Waitlist fetch error:", err);
    }
    setSubmitted(true);
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
      style={{
        animation: reduced ? "none" : "modalOverlayIn 200ms ease-out both",
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--hair)",
          animation: reduced ? "none" : "modalPanelIn 250ms ease-out both",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{
            border: "1px solid var(--hair)",
            color: "var(--muted)",
          }}
        >
          <IconClose className="h-4 w-4" />
        </button>

        <p
          className="text-xs uppercase tracking-[0.22em]"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}
        >
          Harvest Record
        </p>
        <h2
          id="modal-title"
          className="mt-2 text-2xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ink)" }}
        >
          {chili.name}
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
          {chili.region}, {chili.country}
        </p>

        <dl className="mt-5 space-y-2 border-t pt-5" style={{ borderColor: "var(--hair)" }}>
          {chili.archiveNo && (
            <div className="flex justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--muted)" }}>
                Archive No.
              </dt>
              <dd className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
                {chili.archiveNo}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--muted)" }}>
              Species
            </dt>
            <dd className="text-sm italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ink)" }}>
              {chili.species}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--muted)" }}>
              Harvest
            </dt>
            <dd className="text-sm" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--ink)" }}>
              {chili.harvestYear}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-sm italic" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ink)" }}>
          {chili.notes.join(" · ")}
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
          Heat: {formatSHURange(chili.heat.min, chili.heat.max)} · {chili.heat.descriptor}
        </p>

        {submitted ? (
          <div
            className="mt-6 rounded-2xl px-5 py-4 text-center"
            style={{
              background: "var(--faint)",
              border: "1px solid var(--hair)",
              animation: "fadeIn 300ms ease-out both",
            }}
          >
            <p className="text-lg" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ink)" }}>
              Noted. Thank you.
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
              We'll reach out when this harvest is ready.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6" aria-label="Waitlist form">
            <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}>
              Join the waitlist for this harvest.
            </p>
            <label htmlFor={emailId} className="sr-only">
              Email
            </label>
            <div className="mt-3 flex flex-col gap-3">
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  border: "1px solid var(--hair)",
                  background: "var(--faint)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2"
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                Reserve my place
                <IconArrowRight className="h-4 w-4 opacity-80" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Chili Card ─────────────────────────────────────────────────────────── */

function ChiliCard({ chili, onWaitlist }: { chili: Chili; onWaitlist: (c: Chili) => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="overflow-hidden rounded-3xl"
      style={{ border: "1px solid var(--hair)" }}
    >
      <div
        className="relative h-[280px] overflow-hidden"
        style={{ background: "color-mix(in oklab, var(--paper) 78%, var(--earth))" }}
      >
        {!imgError && (
          <Image
            src={chili.image}
            alt={`${chili.name} dried chili pods`}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            onError={() => setImgError(true)}
          />
        )}
        {chili.available && (
          <span
            className="absolute right-3 top-3 text-[9px] uppercase"
            style={{
              background: "#1A3D22",
              color: "#4CAF72",
              letterSpacing: "0.2em",
              padding: "3px 8px",
            }}
          >
            Available
          </span>
        )}
      </div>

      <div className="border-t p-6" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="text-xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ink)" }}
          >
            {chili.name}
          </h3>
          <span className="shrink-0 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
            {chili.harvestYear}
          </span>
        </div>

        <p
          className="mt-1 text-[10px] uppercase"
          style={{ letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "14px", fontFamily: "var(--font-dm-sans)" }}
        >
          {chili.region}, {chili.country}
        </p>

        <div className="flex flex-wrap gap-1.5" style={{ marginBottom: "14px" }}>
          {chili.notes.map((note) => (
            <span
              key={note}
              className="italic"
              style={{
                background: "var(--faint)",
                color: "var(--earth)",
                fontFamily: "var(--font-cormorant)",
                fontSize: "10px",
                padding: "3px 8px",
              }}
            >
              {note}
            </span>
          ))}
        </div>

        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)", marginBottom: "14px" }}
        >
          {chili.drying}
        </p>

        <hr style={{ borderColor: "var(--hair)", marginBottom: "14px" }} aria-hidden="true" />

        <div className="flex justify-between gap-2" style={{ marginBottom: "6px" }}>
          <span
            className="uppercase"
            style={{ fontSize: "9px", letterSpacing: "0.15em", color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}
          >
            Heat
          </span>
          <span
            className="text-right"
            style={{ fontSize: "9px", color: "var(--ink)", fontFamily: "var(--font-dm-sans)" }}
          >
            {formatSHURange(chili.heat.min, chili.heat.max)} · {chili.heat.descriptor}
          </span>
        </div>

        <div className="flex justify-between gap-2" style={{ marginBottom: "6px" }}>
          <span
            className="uppercase"
            style={{ fontSize: "9px", letterSpacing: "0.15em", color: "var(--muted)", fontFamily: "var(--font-dm-sans)" }}
          >
            Ideal for
          </span>
          <span
            className="text-right"
            style={{ fontSize: "9px", color: "var(--ink)", fontFamily: "var(--font-dm-sans)" }}
          >
            {chili.use}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onWaitlist(chili)}
          aria-label={chili.available ? `Reserve ${chili.name} harvest` : `Join waitlist for ${chili.name}`}
          className="mt-4 w-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2"
          style={{
            background: chili.available ? "var(--ink)" : "transparent",
            border: chili.available ? "none" : "1px solid var(--hair)",
            color: chili.available ? "var(--paper)" : "var(--muted)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {chili.available ? "Reserve this harvest" : "Join waitlist"}
        </button>

        {chili.archiveNo && (
          <p
            className="mt-3 text-center"
            style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.1em", color: "var(--muted)" }}
          >
            {chili.archiveNo}
          </p>
        )}
      </div>
    </article>
  );
}

/* ─── Chili Carousel ─────────────────────────────────────────────────────── */

function ChiliCarousel({
  chilies,
  onWaitlist,
}: {
  chilies: Chili[];
  onWaitlist: (c: Chili) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function updateVisible() {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const total = chilies.length;
  const maxIndex = Math.max(0, total - visibleCount);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const trackWidthPct = (total / visibleCount) * 100;
  const translatePct = (currentIndex / total) * 100;

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          aria-label="Previous"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2"
          style={{
            border: "1px solid var(--hair)",
            color: "var(--muted)",
            opacity: currentIndex === 0 ? 0.25 : 1,
            pointerEvents: currentIndex === 0 ? "none" : "auto",
          }}
        >
          ←
        </button>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-[400ms] ease-out"
            style={{
              width: `${trackWidthPct}%`,
              transform: `translateX(-${translatePct}%)`,
            }}
          >
            {chilies.map((chili) => (
              <div
                key={chili.name}
                className="px-3"
                style={{ width: `${100 / total}%` }}
              >
                <ChiliCard chili={chili} onWaitlist={onWaitlist} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(maxIndex, i + 1))}
          aria-label="Next"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2"
          style={{
            border: "1px solid var(--hair)",
            color: "var(--muted)",
            opacity: currentIndex >= maxIndex ? 0.25 : 1,
            pointerEvents: currentIndex >= maxIndex ? "none" : "auto",
          }}
        >
          →
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {chilies.map((chili, i) => (
          <button
            key={chili.name}
            type="button"
            onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
            aria-label={`Go to ${chili.name}`}
            aria-current={i === currentIndex}
            className="focus:outline-none focus:ring-2"
            style={{
              height: "2px",
              borderRadius: "1px",
              width: i === currentIndex ? "20px" : "8px",
              background: i === currentIndex ? "var(--ink)" : "var(--hair)",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Topographic SVG ────────────────────────────────────────────────────── */

function TopoSVG() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <g fill="none" stroke="var(--panel-text)" strokeWidth="0.8">
        {/* Central highland peak */}
        <path d="M960,500 C1010,482 1065,478 1100,498 C1135,518 1142,550 1122,574 C1102,598 1058,610 1005,607 C952,604 908,587 890,560 C872,533 878,506 912,495 C930,489 946,495 960,500Z" />
        <path d="M960,465 C1038,440 1115,435 1162,464 C1209,493 1218,540 1192,578 C1166,616 1104,638 1030,636 C956,634 895,614 860,576 C825,538 828,492 866,468 C888,455 925,460 960,465Z" />
        <path d="M960,425 C1068,393 1168,386 1228,424 C1288,462 1300,520 1268,570 C1236,620 1158,650 1062,650 C966,650 882,624 836,572 C790,520 792,456 836,422 C862,404 912,416 960,425Z" />
        <path d="M960,380 C1100,340 1224,332 1298,378 C1372,424 1388,494 1350,556 C1312,618 1218,656 1102,658 C986,660 880,632 822,568 C764,504 764,428 812,384 C840,362 900,370 960,380Z" />
        <path d="M960,330 C1132,282 1282,272 1370,328 C1458,384 1478,468 1434,545 C1390,622 1278,668 1140,672 C1002,676 878,644 806,564 C734,484 732,390 786,336 C818,308 888,318 960,330Z" />
        <path d="M960,276 C1166,220 1342,208 1444,274 C1546,340 1570,440 1520,530 C1470,620 1342,676 1180,682 C1018,688 876,652 790,558 C704,464 700,352 760,286 C796,252 878,258 960,276Z" />
        <path d="M960,216 C1200,152 1404,138 1520,216 C1636,294 1664,412 1606,516 C1548,620 1406,686 1220,694 C1034,702 874,660 774,550 C674,440 668,314 734,234 C774,194 866,196 960,216Z" />
        <path d="M960,150 C1234,78 1468,62 1598,152 C1728,242 1760,380 1694,500 C1628,620 1470,698 1260,708 C1050,718 872,668 758,540 C644,412 636,270 708,178 C752,126 854,118 960,150Z" />
        <path d="M960,78 C1268,0 1534,-18 1678,86 C1822,190 1858,350 1784,486 C1710,622 1534,712 1300,724 C1066,736 870,678 740,528 C610,378 600,222 680,118 C728,54 842,30 960,78Z" />

        {/* Secondary ridge — lower left */}
        <path d="M280,720 C318,706 356,708 378,726 C400,744 400,772 380,790 C360,808 326,812 298,798 C270,784 254,758 260,736 C266,720 268,720 280,720Z" />
        <path d="M280,688 C332,668 384,670 414,694 C444,718 446,756 420,784 C394,812 344,824 302,810 C260,796 232,760 238,728 C244,704 262,692 280,688Z" />
        <path d="M280,652 C348,625 412,626 452,656 C492,686 494,736 464,772 C434,808 370,824 314,810 C258,796 222,752 228,710 C234,676 260,658 280,652Z" />
        <path d="M280,614 C366,580 444,580 494,618 C544,656 546,718 510,762 C474,806 396,828 326,812 C256,796 210,742 216,690 C222,648 254,622 280,614Z" />

        {/* Distant eastern range */}
        <path d="M1680,200 C1730,188 1784,192 1820,216 C1856,240 1860,278 1836,306 C1812,334 1762,344 1714,330 C1666,316 1638,284 1646,252 C1652,230 1666,208 1680,200Z" />
        <path d="M1680,162 C1756,144 1836,148 1888,180 C1940,212 1946,264 1916,304 C1886,344 1820,364 1748,350 C1676,336 1628,292 1636,246 C1642,214 1660,174 1680,162Z" />
      </g>
    </svg>
  );
}

/* ─── Floating Nav ───────────────────────────────────────────────────────── */

function FloatingNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      aria-label="Site navigation"
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 sm:px-10"
      style={{
        background: scrolled ? "rgba(14,10,6,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,196,168,0.08)" : "none",
      }}
    >
      <a
        href="#"
        className="uppercase tracking-[0.22em] text-sm transition-opacity hover:opacity-70"
        style={{ fontFamily: "var(--font-cormorant)", color: "var(--paper)", textDecoration: "none" }}
      >
        CLUBA
      </a>
      <div className="flex items-center gap-6 sm:gap-8">
        <a
          href="#collection"
          className="hidden text-[0.65rem] uppercase tracking-[0.15em] transition-opacity hover:opacity-100 sm:block"
          style={{ color: "rgba(232,221,208,0.55)", fontFamily: "var(--font-dm-sans)", textDecoration: "none" }}
        >
          Collection
        </a>
        <a
          href="#process"
          className="hidden text-[0.65rem] uppercase tracking-[0.15em] transition-opacity hover:opacity-100 sm:block"
          style={{ color: "rgba(232,221,208,0.55)", fontFamily: "var(--font-dm-sans)", textDecoration: "none" }}
        >
          Process
        </a>
        <a
          href="#waitlist-earned"
          className="rounded-sm px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] transition-colors duration-200"
          style={{
            background: "var(--accent)",
            color: "var(--paper)",
            fontFamily: "var(--font-dm-sans)",
            textDecoration: "none",
          }}
        >
          Reserve
        </a>
      </div>
    </nav>
  );
}

/* ─── Section 1: Hero ────────────────────────────────────────────────────── */

function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section
      id="hero"
      style={{
        background: "var(--void)",
        height: "100svh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Topographic SVG — drifts slowly; disabled on mobile */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-10% -5%",
          zIndex: 0,
          opacity: isMobile ? 0.02 : 0.04,
          animation: (reduced || isMobile) ? "none" : "topoShift 20s ease-in-out infinite alternate",
        }}
      >
        <TopoSVG />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontSize: "clamp(4.5rem, 12vw, 10rem)",
            letterSpacing: "0.22em",
            color: "var(--paper)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          CLUBA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginTop: "2rem",
          }}
        >
          Beyond Heat. Defined by Origin.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2.2, duration: 1 }}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--panel-text)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <svg width="1" height="40" viewBox="0 0 1 40">
          <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ─── Section 2: Origin Sequence ─────────────────────────────────────────── */

function DesktopOriginPanel({
  origin,
  index,
  activeIndex,
  progress,
}: {
  origin: OriginEntry;
  index: number;
  activeIndex: number;
  progress: number;
}) {
  let opacity = 0;

  if (index === activeIndex) {
    opacity = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;
  } else if (index === activeIndex + 1) {
    opacity = progress > 0.85 ? (progress - 0.85) / 0.15 : 0;
  }

  if (index === ORIGINS.length - 1 && activeIndex === ORIGINS.length - 1) {
    opacity = 1;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 0.15s ease",
        zIndex: index === activeIndex ? 2 : index === activeIndex + 1 ? 1 : 0,
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={origin.imagePath}
          alt={origin.imageAlt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: origin.objectPosition }}
        />
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: "linear-gradient(to right, rgba(14,10,6,0.88) 45%, rgba(14,10,6,0.2) 100%)",
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(3rem, 8vw, 8rem)",
        }}
      >
        <div style={{ maxWidth: "38rem" }}>
          <p
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            {String(index + 1).padStart(2, "0")} — {origin.region} · {origin.elevation}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              color: "var(--paper)",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {origin.chili}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
              color: "var(--panel-text)",
              lineHeight: 1.8,
              marginTop: "1.5rem",
              maxWidth: "34ch",
            }}
          >
            {origin.fieldNote}
          </p>

          <p
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: "2rem",
            }}
          >
            Archive № {origin.archiveNo}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile origin panels ───────────────────────────────────────────────── */

function MobileOriginPanel({ origin, index }: { origin: OriginEntry; index: number }) {
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", background: "var(--deep)" }}>
      {/* Image — top half */}
      <div style={{ position: "relative", height: "55vw", minHeight: "240px", flexShrink: 0 }}>
        <Image
          src={origin.imagePath}
          alt={origin.imageAlt}
          fill
          loading="eager"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: origin.objectPosition }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(14,10,6,0.2) 0%, rgba(14,10,6,0.92) 100%)",
          }}
        />
      </div>

      {/* Text — bottom half */}
      <div style={{ padding: "1.5rem 1.75rem 3rem", flex: 1 }}>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {String(index + 1).padStart(2, "0")} — {origin.region} · {origin.elevation}
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.5rem, 12vw, 3.5rem)", color: "var(--paper)", lineHeight: 1.05, marginTop: "0.75rem" }}>
          {origin.chili}
        </h2>
        <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "1.1rem", color: "var(--panel-text)", lineHeight: 1.8, marginTop: "1.25rem" }}>
          {origin.fieldNote}
        </p>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-dm-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", marginTop: "1.75rem" }}>
          Archive № {origin.archiveNo}
        </p>
      </div>

      {/* Divider between panels */}
      {index < ORIGINS.length - 1 && (
        <div aria-hidden="true" style={{ height: "1px", background: "rgba(212,196,168,0.12)", margin: "0 1.75rem" }} />
      )}
    </div>
  );
}

function OriginSequenceMobile() {
  return (
    <div style={{ background: "var(--deep)" }}>
      {ORIGINS.map((origin, i) => (
        <MobileOriginPanel key={origin.id} origin={origin} index={i} />
      ))}
    </div>
  );
}

function OriginSequenceDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = container.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY - containerTop);
      const rawProgress = Math.min(1, scrolled / scrollableDistance);

      const panelProgress = rawProgress * ORIGINS.length;
      const index = Math.min(ORIGINS.length - 1, Math.floor(panelProgress));
      const withinPanel = panelProgress - index;

      setActiveIndex(index);
      setProgress(withinPanel);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: `${(ORIGINS.length + 1) * 100}vh`, position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--void)",
        }}
      >
        {ORIGINS.map((origin, i) => (
          <DesktopOriginPanel
            key={origin.id}
            origin={origin}
            index={i}
            activeIndex={activeIndex}
            progress={progress}
          />
        ))}

        {/* Scroll progress indicator */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "2rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1px",
            height: "6rem",
            background: "rgba(212,196,168,0.15)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${((activeIndex + progress) / ORIGINS.length) * 100}%`,
              background: "var(--accent)",
              transition: "height 0.1s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function OriginSequence() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile ? <OriginSequenceMobile /> : <OriginSequenceDesktop />;
}

/* ─── Section 3: Waitlist Earned ─────────────────────────────────────────── */

function WaitlistEarned() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const emailId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "waitlist-earned" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Waitlist failed:", (data as { error?: string }).error);
      }
    } catch (err) {
      console.error("Waitlist fetch error:", err);
    }
    setJoined(true);
  }

  return (
    <section
      id="waitlist-earned"
      style={{
        background: "var(--ink)",
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 6vw, 4rem)",
      }}
    >
      <Reveal>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Three Landscapes
          </p>

          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              color: "var(--paper)",
              lineHeight: 1.2,
              marginTop: "1.5rem",
            }}
          >
            You've just traveled 3,800 meters of altitude.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              color: "var(--panel-text)",
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              lineHeight: 1.75,
              marginTop: "1.5rem",
              maxWidth: "44ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The first pods ship this season. Reserve yours before they&apos;re archived.
          </p>

          {joined ? (
            <p
              role="status"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: "var(--panel-text)",
                marginTop: "3rem",
              }}
            >
              Noted. You&apos;ll hear from us before the pods ship.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              aria-label="Waitlist signup"
              style={{ marginTop: "3rem" }}
            >
              <label htmlFor={emailId} className="sr-only">
                Email address
              </label>
              <div
                className="flex flex-col gap-3 sm:flex-row"
                style={{ maxWidth: "420px", margin: "0 auto" }}
              >
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full sm:flex-1"
                  style={{
                    background: "#2A1E14",
                    border: "1px solid var(--muted)",
                    color: "var(--paper)",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.9rem",
                    outline: "none",
                    borderRadius: "2px",
                  }}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto"
                  style={{
                    background: "var(--accent)",
                    color: "var(--paper)",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "opacity 200ms",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reserve a Pod
                </button>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.6rem",
                  color: "var(--muted)",
                  textAlign: "center",
                  marginTop: "1rem",
                  letterSpacing: "0.05em",
                }}
              >
                Limited to the 2025 harvest. Single-origin. Whole dried.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Section 4: Collection ──────────────────────────────────────────────── */

function CollectionSection({ onWaitlist }: { onWaitlist: (c: Chili) => void }) {
  return (
    <section
      id="collection"
      style={{
        background: "var(--paper)",
        padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 4rem)",
        position: "relative",
      }}
    >
      {/* Dark → light transition bridge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, var(--ink), var(--paper))",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--ink)",
              }}
            >
              The Collection — 2025 Harvest
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                color: "var(--muted)",
                marginTop: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              Four origins. Four drying methods. Named, numbered, archived.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <ChiliCarousel chilies={FEATURED_CHILIES} onWaitlist={onWaitlist} />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Section 5: Process ─────────────────────────────────────────────────── */

function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        background: "var(--faint)",
        padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--ink)",
              textAlign: "center",
              marginBottom: "4rem",
            }}
          >
            Field to Pod
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {PROCESSES.map((p, i) => (
            <Reveal key={p.method} delayMs={i * 80}>
              <div>
                {i > 0 && (
                  <hr
                    aria-hidden="true"
                    className="block md:hidden mb-10"
                    style={{ borderColor: "rgba(139,115,85,0.25)" }}
                  />
                )}
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "2.2rem",
                    color: "var(--earth)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {p.mark}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 400,
                    fontSize: "1.8rem",
                    color: "var(--ink)",
                    marginBottom: "1rem",
                  }}
                >
                  {p.method}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                    lineHeight: 1.8,
                  }}
                >
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Kitchen ─────────────────────────────────────────────────── */

function KitchenSection() {
  return (
    <section
      style={{
        background: "var(--paper)",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)",
      }}
    >
      <Reveal>
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "2.5rem",
            }}
          >
            In Your Kitchen
          </p>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
              color: "var(--ink)",
              lineHeight: 1.9,
              marginBottom: "3rem",
            }}
          >
            A guajillo from Oaxaca dropped into a braise is not a background
            note. It is the braise. It lifts the fat, defines the color, and
            leaves something in the bottom of the pot that tells you where it
            came from. This is what named origin does to a dish. It makes the
            source legible.
          </p>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 2.2vw, 1.7rem)",
              color: "var(--accent)",
              lineHeight: 1.4,
            }}
          >
            &ldquo;The pod is the record. The dish is the listening.&rdquo;
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Section 7: Close ───────────────────────────────────────────────────── */

function CloseSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const emailId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "newsletter" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Waitlist failed:", (data as { error?: string }).error);
      }
    } catch (err) {
      console.error("Waitlist fetch error:", err);
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <section
      id="about"
      style={{
        background: "var(--void)",
        padding: "clamp(6rem, 14vw, 12rem) clamp(1.5rem, 6vw, 4rem)",
        textAlign: "center",
      }}
    >
      <Reveal>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--paper)",
              lineHeight: 1.25,
            }}
          >
            Grown in one place. Named. Numbered. Yours.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginTop: "3rem",
              letterSpacing: "0.06em",
            }}
          >
            Field Notes — occasional dispatches from origin
          </p>

          <form
            onSubmit={handleSubmit}
            aria-label="Newsletter signup"
            className="flex flex-col gap-3 sm:flex-row"
            style={{
              marginTop: "1.25rem",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:flex-1"
              style={{
                background: "#2A1E14",
                border: "1px solid rgba(139,115,85,0.5)",
                color: "var(--paper)",
                padding: "0.7rem 1rem",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.875rem",
                outline: "none",
                borderRadius: "2px",
              }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto"
              style={{
                background: "var(--accent)",
                color: "var(--paper)",
                border: "none",
                padding: "0.7rem 1.25rem",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p
              role="status"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginTop: "1rem",
                animation: "fadeIn 300ms ease-out both",
              }}
            >
              Noted. Thank you.
            </p>
          )}

          {/* Colophon */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--muted)",
              opacity: 0.45,
              marginTop: "5rem",
            }}
          >
            CLUBA · Mexico · 2025 Harvest · cluba.com
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--muted)",
              opacity: 0.25,
              marginTop: "0.5rem",
            }}
          >
            Beyond Heat. Defined by Origin.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [activeChili, setActiveChili] = useState<Chili | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--void)" }}>
      <SkipLink />
      <FloatingNav scrolled={scrolled} />

      <main id="main">
        <HeroSection />
        <OriginSequence />
        <WaitlistEarned />
        <CollectionSection onWaitlist={setActiveChili} />
        <ProcessSection />
        <KitchenSection />
        <CloseSection />
      </main>

      {activeChili && (
        <WaitlistModal
          chili={activeChili}
          onClose={() => setActiveChili(null)}
        />
      )}
    </div>
  );
}
