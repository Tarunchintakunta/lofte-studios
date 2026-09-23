# Launch checklist — Løfte Studios

Everything the site cannot supply for itself. Each item is registered in
[`src/lib/placeholders.ts`](src/lib/placeholders.ts) by `id`, and a test asserts
that every registered id still appears in this file, so the two cannot drift.

**Nothing on this site invents a client, a sector, a result, a testimonial, an
award, or a credential.** Where a fact is missing, the page says so in a
labelled note rather than filling the space. That is deliberate, and it is the
reason this list exists.

## Recorded deviation from the brief

**The site is light. `DESIGN_BRIEF.md` specifies ink as the main background.**
The studio asked for a light theme after the first build, so this was changed
deliberately. Consequences worth knowing:

- The closing CTA is a blue-_tinted_ light field, not a solid `#284BFF` band.
  A full-bleed brand blue has a relative luminance of 0.127 — it reads as a
  dark field, which is what was being moved away from. Blue now appears only on
  buttons, links, and small marks.
- Coral survives only as `#C43E28`. The brief's `#FF735D` is 2.36:1 on paper
  and cannot be used for anything a reader has to see.
- `.surface-ink` is still defined and still correct. If a single dark section
  is ever wanted back, it is one prop on one `<Section>`.

If the brief is the authority rather than the request, this is the item to
revisit first.

---

## 1. Blocking — the site should not go live without these

### `contact-email` · Approved enquiry inbox

Currently `hello@example.com`, which appears in the footer, on `/contact`, on
`/privacy`, and in the form's fallback text.
**Do:** set `site.email` in [`src/lib/site.ts`](src/lib/site.ts).

### `email-delivery` · Working enquiry delivery

The form validates and rate-limits, but sends nothing. Mail goes out only when
**all three** of `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`
are set, so a stray key alone cannot start real delivery.

In production without them, the form **reports the failure** and points at a
direct address — it never shows a success screen over a dropped message. That
is the current live behaviour and it is the reason this item is blocking.

**Do:** create a Resend account, verify the sending domain, set the three
variables in Vercel, then send one real test enquiry and confirm it arrives.

### `domain` · Production domain

`NEXT_PUBLIC_SITE_URL` drives canonical URLs, the sitemap, Open Graph URLs, and
`robots.txt`. While it is not an `https://` non-localhost origin, **`robots.txt`
disallows everything** — that is intentional, so a preview deploy cannot be
indexed, but it also means the real site stays out of search until this is set.
**Do:** set `NEXT_PUBLIC_SITE_URL` to the production origin, with no trailing
slash.

### `legal-name` · Registered business name

Shown in the footer copyright and in the Organization JSON-LD.
**Do:** set `site.legalName`.

### `privacy-policy` · Real privacy policy

[`/privacy`](src/app/privacy/page.tsx) is **not a privacy policy**. It is a
factual description of what the site does — no cookies, no analytics, no
database, self-hosted fonts, form contents emailed to the studio — written so a
lawyer has something concrete to work from. It is `noindex` and excluded from
the sitemap. The form's consent checkbox links to it.

Still undecided and listed on the page itself: retention period, who can read
enquiries, legal basis and jurisdiction, the correction/deletion route, and the
published address.
**Do:** replace the page with a reviewed policy.

---

## 2. Content and assets

### `logo-svg` · Wordmark

The current mark is an original placeholder: the wordmark set in DM Sans with
the ø carrying the signal accent. It is honest but it is not a designed
identity.
**Do:** supply SVG (light and dark), a favicon set, and an apple-touch icon.
Then replace [`src/components/layout/Logo.tsx`](src/components/layout/Logo.tsx)
and add the icon files to `src/app/`.

The generated social card at
[`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx) renders in the
default `next/og` face rather than DM Sans — loading the real display font
there would mean a network fetch at build time. Replace it with a designed card
once the identity exists.

### `case-studies` · 3–6 real case studies

Three reserved slots render as abstract plates. They are `noindex` and excluded
from the sitemap. The listing, the capability filters, the detail template, and
the homepage grid are all live and will populate without a code change.
**Do:** for each piece — title, written client permission, sector, capabilities,
challenge, approach, deliverables, cover asset. Set `status: "published"` in
[`src/content/case-studies.ts`](src/content/case-studies.ts).

> A case study marked `reserved` **cannot** carry results — the schema rejects
> it. Results go in only when the client supplies and approves the figures.

### `case-study-media` · Portfolio media

**Do:** 8–15 high-resolution stills (WebP/AVIF), and 2–3 muted loops of 6–12
seconds as WebM + MP4 with poster frames. Keep hero-adjacent video under ~3 MB
and defer anything non-critical.

### `client-logos` and `testimonials` · Proof

The proof section renders an honest empty state and says why. Neither a logo
nor a quote will render until its `approved` flag is `true` — the content
schema rejects an unapproved entry outright.
**Do:** collect written permission, then add entries to
[`src/content/proof.ts`](src/content/proof.ts).

### `team` · The people

The About page has a team section built and hidden. No colleagues are invented.
**Do:** add names, roles, portraits and short bios to
[`src/content/about.ts`](src/content/about.ts).

### `insights` · Notes

`/notes` shows an empty state and is deliberately **not** in the primary nav,
per `SITE_AND_CONTENT.md`. One template sample exists so the article layout is
reviewable; it has no byline or date, is `noindex`, and is excluded from the
sitemap.
**Do:** publish a real note, delete the sample, then add Notes to `primaryNav`
in [`src/lib/site.ts`](src/lib/site.ts).

### `contact-phone-address` · Phone and postal address

Both empty, and both hidden while empty — nothing renders a blank field.
**Do:** decide whether to publish them, and set `site.phone` / `site.address`.

---

## 3. Integrations

### `analytics` · Analytics decision

Nothing loads. No cookies are set and no third-party request is made, which is
why there is no consent banner.
[`Analytics.tsx`](src/components/seo/Analytics.tsx) is wired for Plausible
(cookieless) and activates only when `NEXT_PUBLIC_ANALYTICS_DOMAIN` is set.
**Do:** decide on a provider. If it sets cookies, `/privacy` has to change and
a consent mechanism has to be added — that is a legal decision, not a technical
one.

### `sanity` · CMS

Schemas exist at [`sanity/schemas/`](sanity/schemas/index.ts) and the content
boundary at [`src/lib/content/`](src/lib/content/index.ts) is already async and
already validates through Zod. Wiring steps are in
[`sanity/README.md`](sanity/README.md).
**Do:** optional. The site runs on typed seed data indefinitely.

---

## 4. Pre-flight

Run before every deploy:

```bash
pnpm verify && pnpm test:e2e
```

Then confirm by hand:

- [ ] `pnpm verify` — lint, typecheck, production build
- [ ] `pnpm test:e2e` — full suite, including no-JS and reduced-motion paths
- [ ] `pnpm shots` and review all four viewports
- [ ] Send one real enquiry and confirm it arrives in the studio inbox
- [ ] Open the site with JavaScript disabled — every section must still read
- [ ] Tab through the homepage — focus is visible on every stop, nothing is skipped
- [ ] Open the mobile menu with a keyboard: Escape closes it, focus returns to the trigger
- [ ] Check `https://<domain>/robots.txt` allows crawling, and `/sitemap.xml` lists only real pages
- [ ] Paste the URL into Slack or iMessage and check the social card
- [ ] Run Lighthouse on `/` and `/work` and note anything below 90

## 5. Deliberately not done

Listed so nobody assumes otherwise:

- **No deployment.** Nothing has been pushed to a host and no domain is configured.
- **No email has been sent.** The delivery path exists and is inert.
- **No external service configured** — no Resend, Sanity, analytics, or DNS account touched.
- **No legal review.** `/privacy` is a placeholder, and no accessibility or
  compliance certification is claimed. The site is built to WCAG AA contrast
  and keyboard standards and is tested for them, which is not the same as an
  audit.
- **No performance budget agreed.** No real media is in the build yet, so any
  number measured now will change.
