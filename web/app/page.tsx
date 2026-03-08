'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type NavLink = { label: string; href: string };

type HeatRange = {
  min: number;
  max: number;
  descriptor: string;
};

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
};

type Post = { title: string; excerpt: string; date: string; href: string; tag: string };

const NAV_LINKS: NavLink[] = [
  { label: 'Origins', href: '#origins' },
  { label: 'Species', href: '#species' },
  { label: 'Process', href: '#process' },
  { label: 'Collection', href: '#collection' },
  { label: 'Journal', href: '#journal' },
  { label: 'About', href: '#about' },
];

const FEATURED_CHILIES: Chili[] = [
  {
    name: 'Guajillo',
    region: 'Oaxaca Highlands',
    country: 'Mexico',
    species: 'Capsicum annuum',
    harvestYear: '2025',
    notes: ['Dried cherry', 'Cocoa husk', 'Black tea'],
    drying: 'Sun-dried for depth and clarity.',
    use: 'Sauces, broths, slow braises',
    heat: { min: 2500, max: 5000, descriptor: 'Gentle warmth' },
    archiveNo: '2025–MX–OAX–GUA',
    available: true,
  },
  {
    name: 'Ancho',
    region: 'Puebla Highlands',
    country: 'Mexico',
    species: 'Capsicum annuum',
    harvestYear: '2025',
    notes: ['Raisin', 'Dark chocolate', 'Dried plum'],
    drying: 'Slow sun-drying to concentrate natural sweetness.',
    use: 'Moles, stews, braised vegetables',
    heat: { min: 1000, max: 2000, descriptor: 'Mild warmth' },
    archiveNo: '2025–MX–PUE–ANC',
    available: true,
  },
  {
    name: 'Chipotle',
    region: 'Sierra Norte',
    country: 'Mexico',
    species: 'Capsicum annuum',
    harvestYear: '2025',
    notes: ['Wood smoke', 'Tamarind', 'Tobacco'],
    drying: 'Traditionally smoked over wood for layered aroma.',
    use: 'Beans, marinades, long-cooked sauces',
    heat: { min: 2500, max: 8000, descriptor: 'Steady warmth' },
    archiveNo: '2025–MX–SNO–CHP',
  },
  {
    name: 'Chile de Árbol',
    region: 'Jalisco',
    country: 'Mexico',
    species: 'Capsicum annuum',
    harvestYear: '2025',
    notes: ['Bright red fruit', 'Clean spice', 'Structured heat'],
    drying: 'Rapid sun-drying to preserve clarity.',
    use: 'Salsas, chili oils, finishing heat',
    heat: { min: 15000, max: 30000, descriptor: 'Direct heat' },
    archiveNo: '2025–MX–JAL–ARB',
  },
];

const JOURNAL_POSTS: Post[] = [
  {
    title: 'How to Taste a Whole Pod',
    excerpt: 'Warm the skin between your palms. Crush lightly. Smell first. Flavor arrives before heat.',
    date: '2026-02-06',
    href: '#journal',
    tag: 'Tasting',
  },
  {
    title: 'Species and Flavor Structure',
    excerpt:
      'Different Capsicum species develop fruit differently. That changes aroma, sweetness, and heat behavior.',
    date: '2026-01-22',
    href: '#journal',
    tag: 'Botany',
  },
  {
    title: 'Drying as Craft',
    excerpt:
      'Sun, shade, and occasional smoke. Drying is a translation step—done slowly to preserve volatile aromatics.',
    date: '2025-12-18',
    href: '#journal',
    tag: 'Process',
  },
];

const SECTION_IMAGES = {
  origin: {
    src: '/images/origin-plate.png',
    alt: 'Volcanic soil and terraced agriculture in soft natural light',
    caption: 'Origin is disclosed. Climate and altitude shape flavor.',
  },
  species: {
    src: '/images/species-plate.png',
    alt: 'Botanical specimen style study of Capsicum plant detail on archival paper',
    caption: 'Species is named. Aroma structure begins in the plant.',
  },
  process: {
    src: '/images/process-plate.png',
    alt: 'Chili pods resting on a traditional drying rack in daylight',
    caption: 'Drying is slow. Whole pods preserve volatile aromatics.',
  },
  packaging: {
    src: '/images/packaging-plate.png',
    alt: 'Minimal matte tube packaging in soft daylight on an archival surface',
    caption: 'Designed to protect aroma—and to be kept.',
  },
} as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatSHURange(min: number, max: number) {
  return `${min.toLocaleString()}–${max.toLocaleString()} SHU`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options);
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function Reveal({
  children,
  className,
  delayMs = 0,
  threshold = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const options = useMemo<IntersectionObserverInit>(() => ({ threshold }), [threshold]);
  const { ref, inView } = useInView<HTMLDivElement>(options);

  return (
    <div
      ref={ref}
      className={cx(
        'will-change-transform',
        reduced ? 'opacity-100' : 'transition-[opacity,transform] duration-700 ease-out',
        reduced ? '' : inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        className
      )}
      style={!reduced ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function useNoiseBackground() {
  return useMemo(() => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 .10 0"/>
        </filter>
        <rect width="160" height="160" filter="url(#n)" opacity=".35"/>
      </svg>
    `);
    return `url("data:image/svg+xml,${svg}")`;
  }, []);
}

function formatDateISO(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString(undefined, { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[var(--paper)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-[0_10px_30px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
    >
      Skip to content
    </a>
  );
}

function SectionFigure({
  src,
  alt,
  caption,
  aspectClass = 'aspect-[16/10]',
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  priority?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)]">
      <div className={cx('relative w-full', aspectClass)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>
      {caption ? (
        <figcaption className="px-5 py-4 font-[var(--sans)] text-xs text-[var(--muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function HeroCTA({
  href,
  label,
  variant = 'primary',
}: {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/90';

  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={cx(
          base,
          'border border-white/35 bg-white/12 text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] hover:bg-white/16'
        )}
      >
        {label}
        <IconArrowRight className="h-4 w-4 opacity-75" />
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cx(base, 'border border-white/28 bg-transparent text-white/90 hover:bg-white/10')}
    >
      {label}
    </a>
  );
}

/* ─── Waitlist Modal ──────────────────────────────────────────────────────── */

function WaitlistModal({ chili, onClose }: { chili: Chili; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus trap — re-runs when submitted changes (focusable set changes)
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(sel));
    focusable[0]?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onTab);
    return () => document.removeEventListener('keydown', onTab);
  }, [submitted]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: value,
          source: 'collection-modal',
          chili: chili.name,
          archiveNo: chili.archiveNo,
        }),
      });
    } catch {
      // graceful — show success regardless of network
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
      style={{ animation: reduced ? 'none' : 'modalOverlayIn 200ms ease-out both' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--hair)] bg-[var(--paper)] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.22)] sm:p-8"
        style={{ animation: reduced ? 'none' : 'modalPanelIn 250ms ease-out both' }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hair)] text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">HARVEST RECORD</p>
        <h2 id="modal-title" className="mt-2 font-[var(--serif)] text-2xl">{chili.name}</h2>
        <p className="mt-1 font-[var(--sans)] text-sm text-[var(--muted)]">
          {chili.region}, {chili.country}
        </p>

        <dl className="mt-5 space-y-2 border-t border-[var(--hair)] pt-5">
          {chili.archiveNo ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">ARCHIVE NO.</dt>
              <dd className="text-xs font-[var(--sans)] text-[var(--muted)]">{chili.archiveNo}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">SPECIES</dt>
            <dd className="text-sm font-[var(--serif)] italic text-[var(--ink)]">{chili.species}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">HARVEST</dt>
            <dd className="text-sm font-[var(--sans)] text-[var(--ink)]">{chili.harvestYear}</dd>
          </div>
        </dl>

        <p className="mt-5 font-[var(--serif)] text-sm italic text-[var(--ink)]">
          {chili.notes.join(' · ')}
        </p>
        <p className="mt-2 font-[var(--sans)] text-xs text-[var(--muted)]">
          Heat: {formatSHURange(chili.heat.min, chili.heat.max)} · {chili.heat.descriptor}
        </p>

        {submitted ? (
          <div
            className="mt-6 rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] px-5 py-4 text-center"
            style={{ animation: 'fadeIn 300ms ease-out both' }}
          >
            <p className="font-[var(--serif)] text-lg">Noted. Thank you.</p>
            <p className="mt-1 font-[var(--sans)] text-xs text-[var(--muted)]">
              We'll reach out when this harvest is ready.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6" aria-label="Waitlist form">
            <p className="font-[var(--sans)] text-sm text-[var(--muted)]">
              Join the waitlist for this harvest.
            </p>
            <label htmlFor={emailId} className="sr-only">Email</label>
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
                className="w-full rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_72%,white)] px-4 py-3 font-[var(--sans)] text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3 text-sm text-[var(--paper)] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
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

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function Page() {
  const noise = useNoiseBackground();
  const reduced = usePrefersReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const emailId = useId();

  const [activeChili, setActiveChili] = useState<Chili | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function onSubmitEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'homepage' }),
      });

      if (!res.ok) throw new Error('Request failed');

      setSubscribed(true);
      setEmail('');
      window.setTimeout(() => setSubscribed(false), 2200);
    } catch {
      setSubscribed(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[color:color-mix(in_oklab,var(--accent)_20%,transparent)] selection:text-[var(--ink)] scroll-smooth"
      style={{
        backgroundImage:
          'radial-gradient(1200px 800px at 15% 0%, rgba(124, 92, 58, 0.10), transparent 55%), radial-gradient(900px 700px at 85% 18%, rgba(124, 30, 26, 0.09), transparent 60%)',
      }}
    >
      <style>{`
        :root {
          --paper:  #F6F1E7;
          --ink:    #111111;
          --muted:  rgba(17,17,17,.70);
          --faint:  rgba(17,17,17,.12);
          --hair:   rgba(17,17,17,.16);
          --accent: #7C1E1A;
          --earth:  #7C5C3A;
          --serif:  ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, "Cormorant Garamond", Garamond, serif;
          --sans:   ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Hero grain drifts slowly — CSS only, respects prefers-reduced-motion above */
        @keyframes grainDrift {
          0%   { background-position: 0% 0%; }
          25%  { background-position: 22% 38%; }
          50%  { background-position: 48% 12%; }
          75%  { background-position: 8% 55%; }
          100% { background-position: 0% 0%; }
        }

        /* Modal entrance animations */
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalPanelIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Generic fade-in used by modal success state */
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <SkipLink />

      {/* Waitlist Modal */}
      {activeChili ? (
        <WaitlistModal chili={activeChili} onClose={() => setActiveChili(null)} />
      ) : null}

      {/* ── Top Nav ─────────────────────────────────────────────────────── */}
      <header
        className={cx(
          'sticky top-0 z-50 border-b backdrop-blur-md transition-[box-shadow,background-color] duration-300',
          scrolled
            ? 'border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_86%,white)] shadow-[0_18px_55px_rgba(0,0,0,0.08)]'
            : 'border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_92%,transparent)] shadow-none'
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-baseline gap-2 rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
              aria-label="CLUBA home"
            >
              <span className="font-[var(--serif)] text-lg tracking-[0.22em] uppercase">CLUBA</span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">Beyond Heat. Defined by Origin.</span>
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group rounded text-sm text-[var(--muted)] outline-none transition-colors hover:text-[var(--ink)] focus:text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                >
                  <span className="relative inline-block pb-1">
                    {l.label}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 -bottom-0.5 h-[1px] w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </span>
                </a>
              ))}
            </div>

            {/* CTA with accent dot */}
            <a
              href="#collection"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.10)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
              aria-label="See current harvest"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              See Current Harvest
              <IconArrowRight className="h-4 w-4 opacity-70" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] px-3 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="font-[var(--sans)] text-[13px] tracking-wide">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </nav>

        {/* Mobile panel — height via grid-rows trick */}
        <div
          id="mobile-menu"
          className={cx(
            'md:hidden border-t border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_92%,transparent)]',
            reduced ? '' : 'transition-[opacity] duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={!menuOpen}
        >
          <div
            className={cx(
              'grid overflow-hidden',
              reduced ? '' : 'transition-[grid-template-rows,transform] duration-300 ease-out',
              menuOpen ? 'grid-rows-[1fr] translate-y-0' : 'grid-rows-[0fr] -translate-y-1'
            )}
          >
            <div className="min-h-0">
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-md px-2 py-2 text-sm text-[var(--muted)] outline-none transition-colors hover:text-[var(--ink)] focus:text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {l.label}
                    </a>
                  ))}
                  <a
                    href="#collection"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    aria-label="See current harvest"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                    See Current Harvest
                    <IconArrowRight className="h-4 w-4 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Cinematic Hero ──────────────────────────────────────────────── */}
        <section aria-label="Hero" className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Cinematic background showing dried chili pods and harvest craft"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(1200px 800px at 50% 30%, rgba(124,92,58,0.15), transparent 60%)',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Animated grain overlay — drifts slowly, respects prefers-reduced-motion */}
          {!reduced ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage: noise,
                backgroundSize: '320px 320px',
                mixBlendMode: 'multiply',
                animation: 'grainDrift 12s linear infinite',
              }}
            />
          ) : null}

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/80">
              WHOLE PODS · HARVEST YEAR LABELED · NO ADDITIVES
            </p>

            <h1
              className="font-[var(--serif)] text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.30)' }}
            >
              Beyond Heat. Defined by Origin.
            </h1>

            <div
              className="mt-6 max-w-2xl space-y-2 font-[var(--sans)] text-base leading-relaxed text-white/85 sm:text-lg"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}
            >
              <p>Single-origin whole dried chilies.</p>
              <p>Labeled by region, species, and harvest year.</p>
              <p>Each pod reflects soil, altitude, and drying method.</p>
              <p className="pt-1 text-white/80">Flavor leads. Heat completes.</p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <HeroCTA href="#origins" label="Browse Origins" variant="primary" />
              <HeroCTA href="#collection" label="See Current Harvest" variant="secondary" />
            </div>
          </div>
        </section>

        {/* ── Origins ─────────────────────────────────────────────────────── */}
        <Reveal delayMs={80}>
          <section aria-label="Origins section" className="py-12 sm:py-16" id="origins">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Chili is agricultural.</h2>

                <div className="mt-5 space-y-3 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  <p>Most dried chili is blended.</p>
                  <p>The field disappears.</p>
                  <p>We keep it visible.</p>
                </div>

                <p className="mt-7 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Place. Plant. Year.</p>

                <p className="mt-6 font-[var(--serif)] text-sm leading-relaxed text-[color:color-mix(in_oklab,var(--ink)_85%,var(--earth))]">
                  Climate shapes sweetness.
                  <br />
                  Altitude refines aroma.
                  <br />
                  Drying preserves depth.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="mb-6">
                  <SectionFigure
                    src={SECTION_IMAGES.origin.src}
                    alt={SECTION_IMAGES.origin.alt}
                    caption={SECTION_IMAGES.origin.caption}
                    aspectClass="aspect-[16/10]"
                  />
                </div>

                <div className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">From field to record</p>
                  <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    From volcanic slopes in Oaxaca to high valleys in Kashmir, each origin carries a distinct expression
                    of the plant.
                  </p>

                  <a
                    href="#species"
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    aria-label="Continue to species"
                  >
                    Continue
                    <IconArrowRight className="h-4 w-4 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Species + Flavor Profile ─────────────────────────────────────── */}
        <Reveal delayMs={120}>
          <section aria-label="Species section" className="py-12 sm:py-16" id="species">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Place. Plant. Year.</h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Origin and species determine fruit chemistry. That changes aroma structure. And how heat arrives.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <SectionFigure
                  src={SECTION_IMAGES.species.src}
                  alt={SECTION_IMAGES.species.alt}
                  caption={SECTION_IMAGES.species.caption}
                  aspectClass="aspect-[4/5]"
                />
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-6">
                  <article className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">ORIGIN</p>
                    <h3 className="mt-2 font-[var(--serif)] text-2xl">Origin as identity</h3>
                    <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      Soil, climate, and altitude shape the fruit.
                    </p>
                    <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      We name every region.
                      <br />
                      We name every harvest.
                    </p>
                  </article>

                  <article className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">SPECIES</p>
                    <h3 className="mt-2 font-[var(--serif)] text-2xl">Plant as species</h3>
                    <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      Chili is a family.
                      <br />
                      Species changes fruit chemistry.
                      <br />
                      That changes aroma structure.
                      <br />
                      And how heat arrives.
                    </p>
                    <div className="mt-5 border-t border-[var(--hair)] pt-5">
                      <p className="font-[var(--serif)] text-sm italic text-[var(--ink)]">Capsicum annuum</p>
                      <p className="font-[var(--serif)] text-sm italic text-[var(--ink)]">Capsicum chinense</p>
                      <p className="font-[var(--serif)] text-sm italic text-[var(--ink)]">Capsicum baccatum</p>
                    </div>
                    <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      Different character.
                      <br />
                      Different finish.
                    </p>
                  </article>

                  <article className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">FLAVOR PROFILE</p>
                    <h3 className="mt-2 font-[var(--serif)] text-2xl">Taste first. Then warmth.</h3>

                    <div className="mt-3 space-y-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      <p>Tasting notes describe fruit and earth.</p>
                      <p>Heat is described as structure.</p>
                    </div>

                    <div className="mt-5 border-t border-[var(--hair)] pt-5">
                      <p className="font-[var(--serif)] text-sm text-[var(--ink)]">Gentle warmth.</p>
                      <p className="font-[var(--serif)] text-sm text-[var(--ink)]">Steady heat.</p>
                      <p className="font-[var(--serif)] text-sm text-[var(--ink)]">Firm finish.</p>
                      <p className="font-[var(--serif)] text-sm text-[var(--ink)]">Clean fade.</p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Process + Purity ─────────────────────────────────────────────── */}
        <Reveal delayMs={160}>
          <section aria-label="Process section" className="py-12 sm:py-16" id="process">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">PROCESS</p>
                <h2 className="mt-2 font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Field to pod</h2>

                <div className="mt-5 space-y-3 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  <p>Harvested at peak maturity.</p>
                  <p>Traditionally dried.</p>
                  <p>Whole pods protect aroma.</p>
                  <p>Grinding is left to the cook.</p>
                  <p>Grind only what you need.</p>
                </div>

                <div className="mt-8">
                  <SectionFigure
                    src={SECTION_IMAGES.process.src}
                    alt={SECTION_IMAGES.process.alt}
                    caption={SECTION_IMAGES.process.caption}
                    aspectClass="aspect-[16/10]"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">How we dry</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    {[
                      { title: 'Sun', body: 'Deeper fruit. Rounder sweetness.' },
                      { title: 'Shade', body: 'Brighter aroma. Cleaner finish.' },
                      { title: 'Smoke', body: 'Used sparingly. Structural, not dominant.' },
                    ].map((m) => (
                      <article
                        key={m.title}
                        className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                      >
                        <h3 className="font-[var(--serif)] text-2xl">{m.title}</h3>
                        <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{m.body}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-[var(--hair)] pt-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Unadjusted</p>
                    <h3 className="mt-2 font-[var(--serif)] text-2xl">Nothing added. Nothing corrected.</h3>
                    <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      Whole pods only. No preservatives. No additives. No artificial coloring.
                    </p>
                    <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                      Minimal matte tubes with an inner pouch. Designed to protect aroma — and to be kept.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Current Harvest ──────────────────────────────────────────────── */}
        <Reveal delayMs={180}>
          <section aria-label="Collection" className="py-12 sm:py-16" id="collection">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">CURRENT HARVEST</p>
                <h2 className="mt-2 font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">
                  Defined by place. Labeled by year.
                </h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Whole pods preserve the volatile aromatics that ground spices lose.
                </p>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                  Harvest quantities vary by season.
                </p>
              </div>

              <a
                href="#origins"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                aria-label="Browse origins"
              >
                Browse Origins
                <IconArrowRight className="h-4 w-4 opacity-70" />
              </a>
            </div>

            {/* Records grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_CHILIES.map((c) => (
                <article
                  key={c.name}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                  aria-label={`${c.name} record`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(124,30,26,.26), rgba(124,92,58,.14), transparent 70%)',
                    }}
                  />

                  <header>
                    {/* Name + Available badge */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-[var(--serif)] text-2xl leading-tight">{c.name}</h3>
                      {c.available ? (
                        <span
                          className="mt-1 shrink-0 rounded-full border border-[var(--hair)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]"
                          style={{ boxShadow: '0 0 12px rgba(124,30,26,0.15)' }}
                        >
                          Available
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 font-[var(--sans)] text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {c.region}, {c.country}
                    </p>
                  </header>

                  {/* Archive metadata block */}
                  <dl className="mt-5 space-y-3 border-t border-[var(--hair)] pt-5">
                    {c.archiveNo ? (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">ARCHIVE NO.</dt>
                        <dd className="text-[11px] font-[var(--sans)] text-[var(--muted)]">{c.archiveNo}</dd>
                      </div>
                    ) : null}

                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">SPECIES</dt>
                      <dd className="text-sm font-[var(--serif)] italic text-[var(--ink)]">{c.species}</dd>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">HARVEST</dt>
                      <dd className="text-sm font-[var(--sans)] text-[var(--ink)]">{c.harvestYear}</dd>
                    </div>
                  </dl>

                  {/* Faint rule between archive metadata and tasting notes */}
                  <hr className="my-4 border-[var(--faint)]" aria-hidden="true" />

                  {/* Tasting notes — italic serif */}
                  <p className="font-[var(--serif)] text-[15px] italic leading-relaxed text-[var(--ink)]">
                    {c.notes.join(' · ')}
                  </p>

                  <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{c.drying}</p>

                  <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    Heat: {formatSHURange(c.heat.min, c.heat.max)} · {c.heat.descriptor}
                  </p>

                  <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    Ideal for: {c.use}
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveChili(c)}
                      aria-label={`View harvest record for ${c.name} ${c.harvestYear}`}
                      className="inline-flex items-center gap-2 rounded outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                      style={{ color: '#8C1C1C' }}
                    >
                      <span
                        className="text-sm underline underline-offset-4 transition-colors"
                        style={{ textDecorationColor: 'rgba(17,17,17,.16)' }}
                      >
                        View Harvest Record
                      </span>
                      <IconArrowRight className="h-4 w-4 opacity-70" />
                    </button>
                  </div>

                  <p className="mt-5 font-[var(--sans)] text-xs text-[var(--muted)]">
                    Whole pods only. Grind as needed.
                  </p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── Journal ──────────────────────────────────────────────────────── */}
        <Reveal delayMs={200}>
          <section aria-label="Journal" className="py-12 sm:py-16" id="journal">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Field Notes.</h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Origin, species, and craft — written clearly. Designed to be useful.
                </p>
              </div>
              <a
                href="/journal"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                aria-label="Read field notes"
              >
                Read Field Notes
                <IconArrowRight className="h-4 w-4 opacity-70" />
              </a>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {JOURNAL_POSTS.map((p) => (
                <article
                  key={p.title}
                  className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                  aria-label={`Journal post: ${p.title}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_65%,white)] px-3 py-1 text-xs text-[var(--muted)]">
                      {p.tag}
                    </span>
                    <time className="text-xs text-[var(--muted)]" dateTime={p.date}>
                      {formatDateISO(p.date)}
                    </time>
                  </div>
                  <h3 className="mt-4 font-[var(--serif)] text-2xl leading-snug">
                    <a
                      href={p.href}
                      className="rounded outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    >
                      {p.title}
                    </a>
                  </h3>
                  <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{p.excerpt}</p>
                  <a
                    href={p.href}
                    className="mt-6 inline-flex items-center gap-2 rounded text-sm text-[var(--ink)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:decoration-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    aria-label={`Read ${p.title}`}
                  >
                    Read
                    <IconArrowRight className="h-4 w-4 opacity-70" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Decorative separator above About */}
        <hr className="border-[var(--hair)]" aria-hidden="true" />

        {/* ── Closing + Email ───────────────────────────────────────────────── */}
        <Reveal delayMs={220}>
          <section aria-label="Closing statement and signup" className="py-12 sm:py-16" id="about">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">CLOSING</p>
                <h2 className="mt-2 font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">
                  Beyond heat.
                  <br />
                  Defined by origin.
                </h2>

                <div className="mt-5 space-y-3 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  <p>Place shapes flavor.</p>
                  <p>Season shapes detail.</p>
                  <p>Heat supports the finish.</p>
                  <p>It never leads.</p>
                </div>

                <div className="mt-8">
                  <SectionFigure
                    src={SECTION_IMAGES.packaging.src}
                    alt={SECTION_IMAGES.packaging.alt}
                    caption={SECTION_IMAGES.packaging.caption}
                    aspectClass="aspect-[4/3]"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Field Notes</p>
                  <h3 className="mt-2 font-[var(--serif)] text-2xl">Receive new harvests and writing.</h3>
                  <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    Occasional. Useful. No excess.
                  </p>

                  <form onSubmit={onSubmitEmail} aria-label="Email signup form" className="mt-6">
                    <label htmlFor={emailId} className="sr-only">
                      Email
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id={emailId}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_72%,white)] px-4 py-3 font-[var(--sans)] text-sm text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
                        aria-label="Email address"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3 text-sm text-[var(--paper)] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                        aria-label="Subscribe to field notes"
                      >
                        Subscribe
                        <IconArrowRight className="h-4 w-4 opacity-80" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-6">
                      <p className="max-w-xl font-[var(--sans)] text-xs leading-relaxed text-[var(--muted)]">
                        Local-only for now. Later, connect via Cloudflare Worker / Pages Function.
                      </p>
                      {/* Success state — fades in smoothly */}
                      <div
                        role="status"
                        aria-live="polite"
                        className={cx(
                          'shrink-0 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_68%,white)] px-3 py-1 text-xs text-[var(--muted)] transition-[opacity] duration-500',
                          subscribed ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        Noted. Thank you.
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer aria-label="Footer" className="border-t border-[var(--hair)] py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[var(--serif)] text-lg tracking-[0.22em] uppercase">CLUBA</p>
              <p className="mt-2 font-[var(--sans)] text-sm text-[var(--muted)]">
                Single-origin whole dried chilies. Region, species, harvest year — labeled clearly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded text-sm text-[var(--muted)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#main"
                className="rounded text-sm text-[var(--muted)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[var(--sans)] text-xs text-[var(--muted)]">
                © {new Date().getFullYear()} CLUBA. Beyond Heat. Defined by Origin.
              </p>
              <p className="mt-1 font-[var(--sans)] text-xs text-[var(--muted)]">
                Whole pods. Named origins. Honest heat.
              </p>
            </div>
            <p className="font-[var(--sans)] text-xs text-[var(--muted)]">
              WHOLE PODS · HARVEST YEAR LABELED · NO ADDITIVES
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
