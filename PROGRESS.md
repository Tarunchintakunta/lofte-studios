# Løfte Studios — build progress

Living status file. Update after every phase so a new session can resume safely.

- **Repo root:** `/Users/tarunchintakunta/Desktop/Lofte`
- **App location:** repo root (Next.js App Router)
- **Kit (source of truth):** `lofte-claude-code-kit/` — `DESIGN_BRIEF.md`, `SITE_AND_CONTENT.md`, `MASTER_PROMPT.md`, `ASSET_CHECKLIST.md`, `MAC_SETUP.md`
- **Toolchain:** Node v25.9.0 · pnpm 10.33.0 · git 2.53.0

---

## Creative direction (locked from DESIGN_BRIEF.md)

**Signal / Story** — Løfte takes scattered business information and resolves it into one clear line of communication.
That idea drives one visual motif reused with discipline: *scatter → alignment → a single travelling signal*.

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
1. *Playwright captured a different project's site.* Port 3100 was already held by an unrelated dev server and `reuseExistingServer` silently reused it. Moved to 4319, set `reuseExistingServer: false`, and added a footer identity assertion so a wrong-server capture now fails loudly.
2. *Header overflowed the viewport at 375px.* `hidden sm:inline-flex` lost to the button's own `inline-flex` because Tailwind resolves by stylesheet order, not attribute order. Added `tailwind-merge` to `cn()` so component styles stay overridable, and the logo now drops "Studios" below `sm`.
3. *Footer overflowed at exactly 768px.* A 12-column grid with 48px gaps left ~14px per column and pushed the email address off-screen. The editorial split now waits for `lg`.
4. *Logo flourish read as a strikethrough.* A hand-drawn extension of the ø slash crossed the L and collided with the f ascender. Replaced: the ø itself carries the field-aware accent colour.

### Phase 2 — Premium homepage (static first, motion second)
- [ ] Hero + signal field (deterministic seeded SVG; static resolved state renders without JS)
- [ ] Capabilities: Copy · Video · Visual · Audio · Localization · Strategy — outcome-led, editorial rows
- [ ] Why Løfte — "A complete content studio, without the usual handoffs."
- [ ] Selected work preview — asymmetric editorial layout, labelled placeholder media
- [ ] The Løfte method — six-step sequential scroll story
- [ ] Proof — labelled placeholder state (no invented logos or testimonials)
- [ ] Closing CTA — "Have a story worth lifting?"
- [ ] Then: GSAP moments only (hero resolve, method narrative). Reduced-motion path verified.
- [ ] Verify: lint · typecheck · build · screenshots @ 4 viewports · critique vs DESIGN_BRIEF

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
- **2026-09-23** — Phases 0 and 1 complete and verified. Starting Phase 2 (homepage).

## Commands
```
pnpm dev          # local dev
pnpm verify       # lint + typecheck + production build
pnpm test:e2e     # smoke: overflow, console errors, a11y, menu keyboard flow
pnpm shots        # full-page captures → screenshots/ at 375/768/1280/1536
```

> Nothing has been committed yet — the kit asks for explicit approval before any commit.
