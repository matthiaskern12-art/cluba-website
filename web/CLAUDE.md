# CLUBA — Claude Code Project Context

> Beyond Heat. Defined by Origin.

This file gives Claude Code full context on the CLUBA project.
Read it before making any suggestions, edits, or new code.

---

## What CLUBA Is

CLUBA is a premium botanical chili brand. We source single-origin whole dried chili pods
from named regions and label every product by species, harvest year, and drying method.

The brand is positioned like single-origin coffee, fine wine, or small-batch olive oil.
It is not a hot sauce brand. It is not a spice brand. It is an agricultural archive.

**Core idea:** Chili is terroir-driven produce. Heat supports flavor. It never leads.

---

## Project Paths

```
Local repo:        ~/dev/cluba-site
Web app:           ~/dev/cluba-site/web
App router:        ~/dev/cluba-site/web/app
Main page:         ~/dev/cluba-site/web/app/page.tsx
Layout:            ~/dev/cluba-site/web/app/layout.tsx
Global CSS:        ~/dev/cluba-site/web/app/globals.css
Images:            ~/dev/cluba-site/web/public/images/
Hero video:        ~/dev/cluba-site/web/public/hero.mp4
Waitlist API:      ~/dev/cluba-site/web/functions/api/waitlist.ts
```

GitHub: https://github.com/matthiaskern12-art/cluba-website.git

---

## Tech Stack

| Layer      | Choice                          |
|------------|---------------------------------|
| Framework  | Next.js (App Router)            |
| Language   | TypeScript (strict)             |
| Styling    | Tailwind CSS (utility-based)    |
| Images     | next/image                      |
| Hosting    | Cloudflare Pages                |
| Backend    | Cloudflare Pages Functions      |
| Storage    | Cloudflare KV                   |

Local dev: `cd ~/dev/cluba-site/web && npm run dev` → http://localhost:3000

---

## Design System

### Color Palette — never change without explicit instruction

```css
--paper:  #F6F1E7   /* warm off-white background — always, never dark mode */
--ink:    #111111   /* primary text */
--muted:  rgba(17,17,17,0.70)
--faint:  rgba(17,17,17,0.12)
--hair:   rgba(17,17,17,0.16)  /* borders */
--accent: #7C1E1A   /* deep chili red — used sparingly */
--earth:  #7C5C3A   /* warm earth tone */
```

### Typography

```css
--serif: ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino,
         "Cormorant Garamond", Garamond, serif;
--sans:  ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
         "Helvetica Neue", Arial, sans-serif;
```

- Serif for all headlines, product names, tasting notes, italic species names
- Sans for labels, specs, body copy, metadata
- Wide letter-spacing on CLUBA logotype: `tracking-[0.22em]`
- Small caps section labels: `text-xs uppercase tracking-[0.22em] text-[var(--muted)]`

### Layout Rules

- Max width: `max-w-7xl` with `px-4 sm:px-6 lg:px-8`
- Containers: `rounded-3xl border border-[var(--hair)]`
- Background tint: `bg-[color:color-mix(in_oklab,var(--paper)_82%,white)]`
- Hover elevation: `hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]`
- Generous whitespace — sections use `py-12 sm:py-16`
- No harsh backgrounds, no saturated colors, no gradients on UI elements

### Motion

- Reveal on scroll via `IntersectionObserver` + `opacity/translate-y` transition
- Duration: 700ms ease-out
- Always respect `prefers-reduced-motion`
- No flashy animations, no bounce, no scale effects

---

## Brand Voice

**Always:**
- Calm, precise, botanical, editorial
- Short deliberate sentences
- Concrete — name the region, the species, the year
- Heat described as structure: "gentle warmth", "steady heat", "firm finish", "clean fade"

**Never:**
- Exclamation marks
- "Spicy", "fire", "blazing", "explosive", "burning"
- Scoville obsession
- Countdown timers, discount messaging, urgency language
- Emoji
- Marketing hype

**Example copy tone:**
```
Defined by place. Labeled by year.
Whole pods preserve aroma.
Heat supports fruit and earth.
```

---

## Product Data Schema

```typescript
type HeatRange = {
  min: number;
  max: number;
  descriptor: string; // "Gentle warmth" | "Steady heat" | "Direct heat" etc.
};

type Chili = {
  name: string;
  region: string;
  country: string;
  species: string;        // always italic serif in UI
  harvestYear: string;
  notes: [string, string, string];  // tasting notes — fruit, earth, finish
  use: string;
  drying: string;
  heat: HeatRange;
  archiveNo?: string;     // format: YYYY–CC–REG–COD
  available?: boolean;
};
```

Heat is displayed subtly as an SHU range + descriptor. No flame icons. No dramatic red bars.

---

## Current Page Sections

1. **Hero** — cinematic video, `Beyond Heat. Defined by Origin.`
2. **Origins** (`#origins`) — chili as agricultural, place/plant/year
3. **Species** (`#species`) — Capsicum varieties, flavor structure
4. **Process** (`#process`) — field to pod, drying methods, packaging story
5. **Collection** (`#collection`) — harvest grid with reserve/waitlist CTAs
6. **Journal** (`#journal`) — Field Notes editorial posts
7. **About + Newsletter** (`#about`) — closing statement + email signup
8. **Footer** — nav links, tagline, copyright

---

## API Endpoints

### POST /api/waitlist

Stores email to Cloudflare KV. Accepts:

```json
{
  "email": "user@domain.com",
  "source": "newsletter" | "collection-modal" | "homepage",
  "chili": "Guajillo",           // optional — from modal
  "archiveNo": "2025–MX–OAX–GUA" // optional — from modal
}
```

---

## What Not to Do

- Do not introduce dark mode — CLUBA is always warm paper
- Do not add Geist, Inter, or system-ui as primary fonts — use the serif/sans stack above
- Do not add ecommerce patterns (cart icons, price badges, star ratings, discount banners)
- Do not add bold accent backgrounds or saturated UI blocks
- Do not add animations beyond the existing Reveal scroll fade
- Do not change the color palette without explicit instruction
- Do not turn this into a typical spice or food brand website
- Do not add Shopify until the test phase is complete and explicitly requested

---

## Current Development Status

- [x] page.tsx — full homepage with all sections
- [x] layout.tsx — metadata, no Geist fonts
- [x] globals.css — brand CSS variables, no dark mode override
- [ ] waitlist.ts — Cloudflare Pages Function (to be built)
- [ ] Product detail pages `/collection/[slug]`
- [ ] Journal article pages `/journal/[slug]`
- [ ] Ecommerce integration (phase 2 — after market test)

---

## Before You Suggest Any Change, Ask:

- Does this feel botanical and archival?
- Is it calm? Is it concrete?
- Does it honor origin over heat?
- Does it avoid mass-market ecommerce patterns?
- Does it respect the existing design system?

If yes → proceed.
If not → refine.
