# Løfte Studios — build progress

Living status file. Update after every phase so a new session can resume safely.

- **Repo root:** `/Users/tarunchintakunta/Desktop/Lofte`
- **App location:** repo root (Next.js App Router)
- **Kit (source of truth):** `lofte-claude-code-kit/` — `DESIGN_BRIEF.md`, `SITE_AND_CONTENT.md`, `MASTER_PROMPT.md`, `ASSET_CHECKLIST.md`, `MAC_SETUP.md`
- **Toolchain:** Node v25.9.0 · pnpm 10.33.0 · git 2.53.0

---

## Creative direction (locked from DESIGN_BRIEF.md)

**Signal / Story** — Løfte takes scattered business information and resolves it into one clear line of communication.
That idea drives one visual motif reused with discipline: _scatter → alignment → a single travelling signal_.

- Hero: bespoke SVG **signal field** (seeded scatter of editorial rules that resolves into register on load). No dashboard, no chart, no blob art.
- Capabilities: editorial rows, not a card grid. A signal line connects the hovered/focused capability to its outcome statement.
- Method: the one legitimate numbered sequence (Discover → Design → Develop → Distribute → Deconstruct → Deliver) as a pinned scroll narrative.
- Palette: Ink `#07111E`, Løfte blue `#284BFF`, Electric sky `#6CA9FF`, Paper `#F4F1E8`, Signal coral `#FF735D` (rare), Mist `#B8C6D5`.
- Type: **Manrope** (UI/body) + **DM Sans** (display, dramatic scale, tight tracking). Both OFL-licensed via `next/font`.

### Hard constraints carried into every phase

No Clear Street layouts/copy/assets. No invented clients, metrics, awards, testimonials, or credentials. No stock office filler,
no universal fade-up, no decorative parallax, no `01/02/03` numbering outside the method, no arbitrary all-caps eyebrows.
Every placeholder is visibly labelled and listed in `LAUNCH_CHECKLIST.md`.

---

## Phases

### Phase 0 — Scaffold & toolchain ✅

- [x] Next.js **16.3.6** (App Router, Turbopack) + React 19.2 + TypeScript + Tailwind **v4**, pnpm
- [x] GSAP, Zod, tailwind-merge, Playwright, Prettier (+ Tailwind class sorting)
- [x] `.env.example`, `.gitignore`, scripts: `lint` `typecheck` `build` `test:e2e` `shots` `verify`
- [x] Verified: lint · typecheck · build all clean

### Phase 1 — Foundation ✅

- [x] Tokens in `src/app/globals.css`: brand constants + **surface-aware semantics** (`.surface-ink` / `.surface-paper` / `.surface-blue` re-declare `--fg`/`--bg`/`--rule`/`--accent`), fluid type scale, container, motion, radii
- [x] **Contrast measured, not assumed.** Findings encoded as rules:
      Løfte blue on ink is 3.20:1 → surfaces and CTAs only, never body text there;
      coral on paper is 2.36:1 → `--color-coral-deep` (4.57:1) is the only coral permitted on paper;
      mist on paper is 1.54:1 → paper gets its own `slate` / `slate-dim` muted ramp.
- [x] DM Sans (display) + Manrope (UI) self-hosted via `next/font`, `latin-ext` for the ø
- [x] Primitives: `Section` / `Container` / `SectionHead`, `Button` / `ButtonLink`, `TextLink`, `PlaceholderNote`, `Logo`
- [x] Floating nav: one shared hairline slides between items and rests under the current section — the indicator doubles as the active state
- [x] Mobile menu: focus trap, scroll lock (scrollbar-compensated), Esc, focus restored to trigger
- [x] Skip link, global focus-visible, reduced-motion base layer
- [x] Verified: lint · typecheck · build · 7 smoke tests · screenshots @ 4 viewports

**Fixed during Phase 1 review**

1. _Playwright captured a different project's site._ Port 3100 was already held by an unrelated dev server and `reuseExistingServer` silently reused it. Moved to 4319, set `reuseExistingServer: false`, and added a footer identity assertion so a wrong-server capture now fails loudly.
2. _Header overflowed the viewport at 375px._ `hidden sm:inline-flex` lost to the button's own `inline-flex` because Tailwind resolves by stylesheet order, not attribute order. Added `tailwind-merge` to `cn()` so component styles stay overridable, and the logo now drops "Studios" below `sm`.
3. _Footer overflowed at exactly 768px._ A 12-column grid with 48px gaps left ~14px per column and pushed the email address off-screen. The editorial split now waits for `lg`.
4. _Logo flourish read as a strikethrough._ A hand-drawn extension of the ø slash crossed the L and collided with the f ascender. Replaced: the ø itself carries the field-aware accent colour.

### Phase 2 — Premium homepage ✅

- [x] **Hero signal field.** Deterministic seeded SVG that resolves into _a page of set editorial type_ — headline bars, blocks with real leading, ragged last lines, and two figures the text wraps around. The markup is the RESOLVED state and GSAP animates _from_ the scatter, so no-JS and reduced-motion visitors land on the finished composition.
- [x] Capabilities — six outcome-led editorial rows with a hairline spine, CSS-only hover
- [x] Why Løfte — handoff diagram built from real text, not drawn
- [x] Selected work — asymmetric layout, abstract reserved plates in the same visual language
- [x] The Løfte method — sticky heading + advancing rail beside six scrolling steps
- [x] Proof — honest empty state; no invented logos or testimonials
- [x] Closing CTA on the blue field (spent exactly once on the page)
- [x] Motion: hero resolve + method rail only. No universal fade-up, no decorative parallax.
- [x] Verified: lint · typecheck · build · 8 smoke tests · captures @ 4 viewports + mobile slices

**Fixed during Phase 2 review**

1. _Screenshots were catching the hero mid-animation._ The `--force-prefers-reduced-motion` launch flag silently did nothing. Switched to Playwright's `reducedMotion: "reduce"` (CDP-emulated), which is also the state the resolved composition must look correct in.
2. _The field read as a wireframe._ Rebuilt the geometry as an editorial page with figure text-wrap; verified programmatically that zero fragments collide with a figure and none escape the viewBox.
3. _The wide work plate was scaled up and cropped_ by a fixed viewBox under `slice`. Plates now derive their viewBox from the slot's aspect ratio.
4. _The handoff diagram argued the opposite of the copy on mobile._ Four stages wrapped two-by-two, leaving the "one continuous line" spanning row one only. The rule now flips orientation instead of wrapping.
5. _`SectionHead`'s aside landed between the heading and the standfirst_ on narrow screens. Grid + `row-start` keeps DOM order readable and lifts it top-right only where there is a column for it.
6. _The hero field never filled its column on mobile_ — a 7/8 box around 7/10 artwork letterboxed under `meet`.

**New permanent test:** `motion.smoke.spec.ts` asserts both ends of the hero timeline — that it animates at all, and that every fragment returns exactly to its authored coordinates. A refactor that inverted the from/to contract would leave no-JS visitors looking at an unresolved mess, and this catches it.

### Phase 3 — Core pages

- [ ] `/services` overview (5 outcome groups) + `/services/[slug]` template
- [ ] `/work` listing with Copy/Video/Visual/Audio/Localization/Strategy filters + `/work/[slug]` template
- [ ] `/approach` (six-step method, expanded — matches "Our approach" nav item)
- [ ] `/about`, `/contact`, `/notes` + `/notes/[slug]` (Insights template; kept out of primary nav until real articles exist)
- [ ] `/privacy` — clearly marked placeholder pending legal review
- [ ] Per page: metadata, OG defaults, heading order, keyboard access, conversion path
- [ ] Verify: lint · typecheck · build · screenshots

### Phase 4 — Content layer

- [ ] Zod-typed content models: settings, service, caseStudy, testimonial, clientLogo, insight, teamMember
- [ ] Local seed data in `content/`, validated at build time, every placeholder flagged
- [ ] `lib/content/` adapter (single swap point) + `sanity/schemas/` mirrors + documented env vars
- [ ] Verify: lint · typecheck · build

### Phase 5 — Contact & SEO

- [ ] Server-side Zod validation, accessible inline errors, success state, honeypot, rate-limit-ready endpoint
- [ ] Mock dev mail handler; real send only when `RESEND_API_KEY` + approved recipient exist (never auto-enabled)
- [ ] `robots.ts`, `sitemap.ts`, canonicals, metadata templates, OG image route
- [ ] JSON-LD: Organization + Service. Analytics placeholder, disabled by default
- [ ] Verify: lint · typecheck · build

### Phase 6 — Quality bar

- [ ] Playwright smoke + responsive suite @ 375/768/1280/1536 (no horizontal scroll, no console errors)
- [ ] a11y sweep: focus indicators, alt text, heading order, menu keyboard flow, form rejection of invalid data
- [ ] Reduced-motion sweep; video poster/fallback; image optimization
- [ ] `LAUNCH_CHECKLIST.md` (assets, legal, analytics, email, domain) + `README.md` run/deploy commands
- [ ] Final screenshot review at all four viewports

---

## Assumptions

1. Building at repo root; `lofte-claude-code-kit/` stays untouched as reference.
2. All business facts (email, phone, legal name, address, clients, testimonials, case studies) are **unknown** → labelled placeholders only.
3. Display face = **DM Sans** (explicitly permitted, OFL-licensed, available through `next/font`).
4. Insights ships as `/notes` with the template built, linked from the footer, not the primary nav (per SITE_AND_CONTENT).
5. No deploys, no email sends, no external service changes, no asset uploads without explicit approval.

## Status log

- **2026-09-23** — Kit read, environment verified, plan written.
- **2026-09-23** — Phases 0 and 1 complete and verified.
- **2026-09-23** — Phase 2 complete. Homepage built and reviewed at four viewports.
- **2026-09-23** — Phases 3, 4, 5 complete. All pages, content boundary, contact form, SEO.
- **2026-09-23** — Phase 6 complete. 83 tests green; `LAUNCH_CHECKLIST.md` and `README.md` written.

## Status: build complete

Every page exists, every check passes, and every unresolved real-world item is
in `LAUNCH_CHECKLIST.md`. **Nothing has been deployed and no email has been
sent.** Repo: https://github.com/Tarunchintakunta/lofte-studios

## Commands

```
pnpm dev          # local dev
pnpm verify       # lint + typecheck + production build
pnpm test:e2e     # smoke: overflow, console errors, a11y, menu keyboard flow
pnpm shots        # full-page captures → screenshots/ at 375/768/1280/1536
```

> Nothing has been committed yet — the kit asks for explicit approval before any commit.

---

# Recovery pass — deliberate zoom + proof of a running site

Triggered by the recovery brief. Three requirements in it are genuinely absent
from the build; everything else in the brief was already implemented and is
re-verified below rather than re-argued.

## Gap analysis

| Requirement                                     | State before this pass                                         |
| ----------------------------------------------- | -------------------------------------------------------------- |
| Hero zoom, `1.08–1.12 → 1` on entry             | **Missing.** The field resolved from scatter but never scaled. |
| Pinned editorial feature zoom, `0.86 → 1.03`    | **Missing.** No pinned section existed anywhere.               |
| Work-card zoom, hover-only, max `1.04`, clipped | **Missing.** Cards changed border and title colour only.       |
| Proof the site runs locally                     | Not previously demonstrated end to end.                        |
| Everything else in the brief                    | Already built and covered by 83 tests.                         |

## Checklist

- [x] **Hero zoom.** The plate settles `1.10 → 1` over 1.9s while the fragments travel in. Its wrapper clips, so fragments arrive from off-frame and the oversized start never reaches the headline column.
- [x] **Editorial feature zoom.** New `FeatureZoom` section, pinned from 768px up, frame scrubbing `0.86 → 1.03`. `pinType: "transform"` — `body` carries `overflow-x: clip`, which can make the body a containing block and leave a `position: fixed` pin scrolling away. Below 768px the pin is replaced by a short non-pinned reveal.
- [x] **Work-card zoom.** Three duplicated card layouts collapsed into one `WorkCard`. The `1.04` scale lives in `.media-frame` / `.media-zoom` in CSS, gated on `(hover: hover) and (pointer: fine)` AND `prefers-reduced-motion: no-preference`, with a matching `:focus-visible` rule so keyboard users get the same affordance.
- [x] **Guard rails.** Verified: no horizontal overflow while a card is hovered; the pin holds under a viewport of extra scroll; every zoom is off under reduced motion.
- [x] **Tests:** `zoom.smoke.spec.ts`, 8 cases across both ends of each range plus the degraded states. The pin range is read from the pin-spacer rather than guessed — the first version sampled past the pin end and captured a misleading "end" frame.
- [x] **Completion gate** delivered.

## Light theme — deviation from DESIGN_BRIEF.md

The studio asked for a light site. `DESIGN_BRIEF.md` specifies ink as the main
background, so this is a **deliberate, recorded departure** rather than a
misreading, and it is listed in `LAUNCH_CHECKLIST.md`.

Because colour was already surface-aware, the flip was a token change rather
than a rewrite. Four light fields now carry the rhythm:

| Field        | Value     | Used for                               |
| ------------ | --------- | -------------------------------------- |
| `chalk`      | `#FBFAF5` | alternating sections                   |
| `paper`      | `#F4F1E8` | the main field (the brief's own paper) |
| `paper-deep` | `#EDEADF` | footer, raised panels                  |
| `wash`       | `#DCDDEB` | the closing invitation                 |

- Ink is now a **type** colour, not a ground. Contrast re-measured: body text clears 13.18:1 on every field, secondary ≥5.53:1, tertiary ≥4.83:1.
- `--color-slate-dim` was darkened `#666B6F → #5F666D`; the old value fell to **4.47:1** on `paper-deep` and would have failed AA.
- The closing CTA is **no longer a solid blue band**. `#284BFF` has a relative luminance of 0.127 — a full-bleed field of it is genuinely dark, which is what was being asked against. Blue is now spent on buttons, links, and marks only.
- The signal system gained its own role tokens (`--signal-quiet/strong/accent/head/plate`) so the hero field and the work plates recolour with whatever field they sit on. `.surface-ink` is retained and still correct, so a dark section can be brought back with one prop.

## GSAP

`gsap` was already a dependency. Added **`@gsap/react`** and adopted `useGSAP`
in `SignalField`, `Method`, and `FeatureZoom` — it scopes selectors and reverts
timelines and ScrollTriggers on unmount without the hand-rolled
`gsap.context()` + `useIsomorphicLayoutEffect` pairing.

## Verified — recovery pass

```
pnpm lint       clean
pnpm typecheck  clean
pnpm build      succeeded — 22 routes
pnpm test:e2e   153 passed (91 smoke + 62 capture)
curl :3000      HTTP 200
```
