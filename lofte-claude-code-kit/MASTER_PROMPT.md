# Master prompt for Claude Code

Paste everything below into Claude Code from the root of an empty project. Copy the other kit files into the project root first.

---

You are the design lead and senior full-stack frontend engineer for Løfte Studios. Build a production-quality public marketing website. Read `README.md`, `DESIGN_BRIEF.md`, `SITE_AND_CONTENT.md`, `ASSET_CHECKLIST.md`, and `MAC_SETUP.md` before writing code. Treat them as the source of truth.

## Objective

Build an original, exceptionally polished Løfte Studios website for a creative-production and digital-storytelling studio. The quality reference is a high-end, cinematic, motion-led corporate site. Do not copy Clear Street or any reference site: do not reproduce its layout, text, navigation, assets, dashboard graphics, video composition, or brand identity.

The website must make prospective clients understand Løfte’s services, see credible proof, and submit a project enquiry. The design must feel authored and intentional, not like a generic agency template.

## Technical decisions

- Use Next.js App Router, TypeScript, and pnpm.
- Use Tailwind CSS for tokens and layout. Add a small, readable global CSS layer only when it improves typography or animation.
- Use GSAP + ScrollTrigger for the limited scroll moments defined in `DESIGN_BRIEF.md`. Use native CSS transitions for simple interaction states. Do not add animation libraries redundantly.
- Use `next/image`, optimized `next/font` or a documented font-loading strategy, semantic HTML, and responsive images.
- Use a content abstraction that works locally first. Prepare a Sanity integration folder/schema and clear environment variables, but do not block the first build on credentials.
- Build the enquiry form with server-side validation using Zod. Use a mock development handler until `RESEND_API_KEY` / approved recipient configuration exists. Never expose secrets to the browser.
- Use Playwright for visual/responsive smoke tests. Test Chromium at 375px, 768px, 1280px, and 1536px wide.

## Working protocol

1. Inspect the current directory and existing files. Preserve user work. Create a concise implementation plan in `PROGRESS.md`, including checklist phases and assumptions.
2. Initialize the project only if it is not already initialized. Install dependencies through pnpm.
3. Build the static homepage first, before CMS integration or elaborate motion. Use clearly labelled placeholder assets from `public/placeholders` where assets are unavailable.
4. Run lint, type check, production build, and local visual checks before marking a phase complete.
5. Capture screenshots at each required viewport. Critique them against `DESIGN_BRIEF.md`: hierarchy, spacing, typography, contrast, non-generic character, animation restraint, and mobile composition. Fix material issues before proceeding.
6. Commit only if a Git repository exists and the user approves commits. Never deploy, publish, purchase, upload client assets, configure domains, or send real email without explicit user direction.
7. Keep `PROGRESS.md` current so work can resume in a new Claude session.

## Required implementation phases

### Phase 1 — Foundation

Create the project, token system, global typography, and accessible layout primitives. Build the header, navigation, footer, buttons, links, and section wrappers. Implement light/dark media handling as needed by the design, without adding a user-facing theme toggle unless useful.

### Phase 2 — Premium homepage

Build all Home sections from `SITE_AND_CONTENT.md`. The hero must use an original CSS/SVG/Canvas “signal field,” not borrowed art or a fake financial dashboard. Make the interaction quiet, fluid, and resilient. The services and work sections must not become generic identical-card grids.

Use real service categories: Copy, Video, Visual, Audio, Localization, Strategy. Build the six-step method as an actual sequential scroll story. Add motion only after the static composition passes visual review.

### Phase 3 — Core pages

Build Services overview, reusable service detail template, Selected Work listing/detail template, About, Contact, and an Insights template. Every page needs metadata, Open Graph defaults, keyboard access, logical heading order, a responsive layout, and a clear conversion path.

### Phase 4 — Content layer

Define Sanity schemas for global settings, service, case study, testimonial, client logo, insight/article, and team member. Add local seed data matching the content model. Make it easy to migrate the rendered pages from seed data to Sanity later.

### Phase 5 — Contact and SEO

Implement form validation, accessible errors, success state, rate-limit-ready server endpoint, robot/sitemap files, canonical URLs, metadata templates, structured data for Organization and Service, and a configurable analytics placeholder. Do not claim legal or compliance work has been completed.

### Phase 6 — Quality bar

Run lint, typecheck, build, and Playwright tests. Verify: no horizontal mobile scrolling; menu is accessible; focus indicators visible; images have useful alt text; animations respect reduced motion; videos have poster/fallback; keyboard navigation works; forms reject invalid data; and key pages have no console errors.

Create `LAUNCH_CHECKLIST.md` containing the unresolved asset, legal, analytics, email, and domain items. Summarize exact commands to run locally and deploy to Vercel in `README.md`.

## Visual implementation requirements

- Build the intentional token system in `DESIGN_BRIEF.md` first. Use CSS variables and shared Tailwind values; do not scatter arbitrary hex values.
- Default body copy to comfortable reading widths and use high contrast. Do not sacrifice accessibility for mood.
- Let typography do meaningful visual work. Use strong display scale without text clipping or artificial line breaks that fail at intermediate widths.
- Use rounded forms only where they reinforce the signal/connection system. Avoid the common “every element is a soft card” pattern.
- Optimize scroll performance. Avoid expensive permanent filters, massive canvases, non-passive listeners, or layout thrashing.
- Use `prefers-reduced-motion` to remove nonessential GSAP timelines and preserve content order.
- Do not use unsourced images, fake customer logos, fake results, or unlicensed fonts.

## Definition of done

Do not say the site is complete until all pages exist, all checks listed in Phase 6 pass, screenshots have been reviewed at each target viewport, placeholder content is clearly marked, and `LAUNCH_CHECKLIST.md` identifies every real-world item the owner must provide. Report concise results, commands run, test outcomes, and remaining owner actions.
