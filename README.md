# Løfte Studios

The marketing site for Løfte Studios — a creative-production and
digital-storytelling partner in Hyderabad.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · GSAP
· Zod · Playwright.

- **Build progress and decisions:** [`PROGRESS.md`](PROGRESS.md)
- **What the owner still has to supply:** [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md)
- **Creative direction (source of truth):** [`lofte-claude-code-kit/`](lofte-claude-code-kit/)

---

## Run it

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>. No environment variables are needed — every
integration degrades to a clearly-labelled stub when its variables are absent.

| Command          | What it does                                                                    |
| ---------------- | ------------------------------------------------------------------------------- |
| `pnpm dev`       | Dev server with Turbopack                                                       |
| `pnpm build`     | Production build                                                                |
| `pnpm start`     | Serve the production build                                                      |
| `pnpm lint`      | ESLint                                                                          |
| `pnpm typecheck` | `next typegen` then `tsc --noEmit`                                              |
| `pnpm verify`    | lint + typecheck + build — run before every push                                |
| `pnpm test:e2e`  | Full Playwright suite against the production build                              |
| `pnpm shots`     | Full-page captures into `screenshots/` at 375/768/1280/1536, plus mobile slices |
| `pnpm format`    | Prettier, including Tailwind class sorting                                      |

`pnpm test:e2e` and `pnpm shots` build and serve the app themselves on port 4319. They never reuse an existing server — an unrelated dev server squatting
on the port would otherwise be screenshotted as if it were this one, which is
exactly what happened once.

## Environment

Copy [`.env.example`](.env.example) to `.env.local`. Nothing in it is required
locally.

| Variable                                                   | Effect when unset                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                     | Canonicals point at localhost, and `robots.txt` disallows everything                                    |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | The enquiry form validates and logs instead of sending. All three are required before any mail goes out |
| `NEXT_PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`            | Content is read from the typed seed in `src/content/`                                                   |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN`                             | No analytics script loads, and no cookies are set                                                       |

`SANITY_API_READ_TOKEN` is server-only. Never give it a `NEXT_PUBLIC_` prefix.

## How it is put together

```
src/
  app/                  Routes. Every page reads content through src/lib/content
  components/
    layout/             Section, Container, Header, Footer, PageHero
    sections/           Homepage sections
    signal/             The hero signal field and its geometry
    seo/                JSON-LD and the analytics placeholder
    ui/                 Button, TextLink, form fields, PlaceholderNote
  content/              Typed seed content + the Zod schemas that guard it
  lib/
    content/            THE CONTENT BOUNDARY — swap this one file for Sanity
    site.ts             Studio facts and navigation
    placeholders.ts     Registry of everything still to be supplied
sanity/                 CMS schemas, not yet wired (see sanity/README.md)
tests/e2e/              Playwright: layout, a11y, motion, SEO, forms, resilience
```

### Design tokens

All of them live in [`src/app/globals.css`](src/app/globals.css). Colour is in
two layers: fixed brand constants, and surface-aware semantics that
`.surface-ink` / `.surface-paper` / `.surface-blue` redeclare. Components use
`text-fg`, `bg-surface`, `border-rule` and never a raw hex value, so a section
can be flipped between editorial fields without touching a component.

Contrast was measured rather than assumed, and the results are encoded as
rules: Løfte blue is 3.20:1 on ink, so it is reserved for surfaces and CTAs and
never used as body text there; coral is 2.36:1 on paper, so a darkened coral is
the only one permitted on that field.

### Motion

GSAP (through `@gsap/react`'s `useGSAP`) runs in exactly four places, each a
deliberate moment rather than an effect:

| Moment     | Behaviour                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Hero       | The plate settles `1.10 → 1` while the scattered fragments resolve, once, on load                |
| Feature    | A pinned frame scrubs `0.86 → 1.03` — from 768px up, `pinType: "transform"`, one viewport of pin |
| Method     | The step rail advances as the six steps scroll past a sticky panel                               |
| Work cards | `scale(1.04)` inside a clipped frame, hover-capable pointers only, with a matching focus state   |

There is no universal fade-up and no decorative parallax. Every one of the four
is off under `prefers-reduced-motion`, and `tests/e2e/zoom.smoke.spec.ts`
asserts both ends of each range plus the degraded state.

The hero's markup **is** the resolved composition; GSAP animates _from_ the
scattered offsets. So a visitor with no JavaScript, or with reduced motion on,
lands on the finished artwork rather than a skeleton.
`tests/e2e/motion.smoke.spec.ts` asserts both ends of that contract, and
`resilience.smoke.spec.ts` covers the degraded paths.

### Content

Nothing on this site invents a client, a result, a testimonial, or a
colleague. Missing facts render as labelled placeholders, each one registered
in `src/lib/placeholders.ts`. A test fails the build if a registered
placeholder is missing from `LAUNCH_CHECKLIST.md`.

Two editorial rules are enforced by the content schema rather than remembered:
an unapproved testimonial or client logo is never rendered, and a case study
marked `reserved` cannot carry results.

## Deploying to Vercel

**Not deployed yet.** Work through
[`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md) first — in particular the enquiry
inbox and the production domain, because `robots.txt` blocks all crawling until
`NEXT_PUBLIC_SITE_URL` is a real `https://` origin.

```bash
# once
npm install --global vercel
vercel login
vercel link

# environment (repeat for preview/development as needed)
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add RESEND_API_KEY production
vercel env add CONTACT_TO_EMAIL production
vercel env add CONTACT_FROM_EMAIL production

# deploy
vercel --prod
```

Vercel detects Next.js and needs no build configuration. `/work` is
server-rendered because it reads `searchParams`; everything else is static or
SSG.

After the first production deploy:

1. Fetch `https://<domain>/robots.txt` and confirm it allows crawling.
2. Fetch `/sitemap.xml` and confirm it lists only real pages.
3. Send one real enquiry and confirm it arrives.
4. Paste the URL into Slack or iMessage and check the social card.

## Licences

DM Sans and Manrope are SIL Open Font License, self-hosted through `next/font`
— no request leaves for a font CDN. No stock photography, no third-party
illustration, and no borrowed layout is used anywhere; every graphic is
generated from the site's own `signal/` geometry.
