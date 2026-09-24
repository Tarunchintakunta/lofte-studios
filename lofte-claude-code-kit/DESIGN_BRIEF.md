# Løfte Studios creative brief

## Brand and audience

Løfte Studios is a Hyderabad creative-production and digital-storytelling partner. It helps growing businesses with copy, video, visuals, audio, localization, and content strategy. The website's job is to make a prospective client feel: “these people will make our brand look and sound more considered.”

The primary action is **Start a project**. The secondary action is **See selected work**.

## Visual point of view

Create an original visual system called **Signal / Story**: Løfte takes scattered business information and turns it into clear, memorable communication. The memorable moment is a living “signal field” in the hero: lines, captions, fragments, and image planes calmly resolve into a single editorial composition as the page loads. It must be bespoke to Løfte, not a dashboard or a financial interface.

### Palette

- Ink — `#07111E`: main background
- Løfte blue — `#284BFF`: active surfaces and decisive CTAs
- Electric sky — `#6CA9FF`: light signal highlights
- Paper — `#F4F1E8`: quiet editorial background
- Signal coral — `#FF735D`: rare accent for an active idea or focus point
- Mist — `#B8C6D5`: subdued text and rules

Use large fields of ink or paper. Avoid indiscriminate gradients. The coral is rare, not a second primary color.

### Typography

Use `Manrope` for navigation, body, controls, and small text. Use `DM Sans` or another licensed, high-quality grotesk display face for display text; use it at dramatic sizes and tight but readable tracking. Do not use Inter, Roboto, Arial, Space Grotesk, or a generic serif pairing.

### Layout

- Desktop container: maximum 1440px, page padding that scales from 20px to 56px.
- Typography is the visual anchor; short copy and very large words have room to breathe.
- Navigation may be a floating rounded translucent bar, but its proportions, content hierarchy, and hover behavior must be original.
- Use full-bleed editorial media only when it tells the service story.
- Use cards selectively. Services should read as substantial editorial modules, not a grid of interchangeable SaaS cards.
- Every section must have a clear reason to exist: a question, proof point, service, work example, or invitation.

### Motion

Motion is editorial, not decorative. Every moment below exists because it carries
meaning that static layout cannot; nothing animates merely to prove the page can.

#### The named moments

Use GSAP + ScrollTrigger only for these:

1. Hero signal field resolves once on load.
2. **The "For" reel** — the word `For` is held while the audiences that complete
   the sentence travel through a focal line. The kinetic list *is* the sentence.
3. The six-step Løfte process progresses as a scroll narrative.
4. **The zoom-through portal** — an aperture punched out of a sheet of paper is
   scaled until the viewer is through it and standing in the dark room where the
   work is shown. One continuous move from the promise to the proof.
5. Case-study media shifts between clipped editorial frames.
6. Service details expand/collapse because the visitor asks for more detail.

Moments 2 and 4 are cinematic and pin the viewport. That is a deliberate revision
of this brief's earlier position that a long pin is always a trap — the studio
asked for two moments with real scale. The revision is narrow: **two** pinned
moments on the homepage, both of which arrive somewhere. It is not a licence for
a third.

Nothing here may be borrowed from Clear Street. The anti-generic rules below
still bind: the aperture is Løfte's own ø read as a lens, the fields are ink and
paper, and there is no dashboard motif anywhere in either moment.

#### Rules that still bind

- No universal fade-up animation. No continuous decorative parallax.
- Respect `prefers-reduced-motion`: reveal all content normally, remove every
  pin, and let the page read top to bottom. The same fallback serves visitors
  with no JavaScript and every viewport under 768px — a phone is never pinned.
- A pinned section must be reachable and readable without the pin. If content
  only exists mid-scrub, it does not exist.

#### How pinned motion has to feel

Smoothness is a measured property, not a taste. The homepage holds these:

- **Pin budget.** No single pin longer than ~200% of the viewport, and no more
  than a quarter of the page's scroll height spent pinned in total. Today: 180%
  for the portal, 200% for the reel.
- **Scrub is short.** 0.4–0.6. A long scrub sounds like "smoother" and reads as
  lag — at `scrub: 1` the reel's track ran 68px behind the scroll and the wrong
  audience held the line for much of the sweep. At 0.45 it runs 30px behind.
- **No dead scroll.** A pinned section may hold still at the end so the arrival
  can be read, but only briefly. A long stretch where nothing responds reads as
  a broken page.
- **State changes must not stack their own lag** on top of the scrub. Focus and
  highlight transitions use `--duration-fast`, not `--duration-base`.
- **`scroll-behavior: smooth` is banned.** It animates every programmatic scroll,
  which is exactly what ScrollTrigger performs when it engages a pin or restores
  position — the two then animate against each other. Measured: one `scrollBy`
  covered 564px in three seconds with `smooth`, against 12053px with `auto`.

#### Navigation

The floating bar tightens as the visitor reads downward and returns to full size
the moment they scroll up, so navigation is always one upward flick away. It is
driven by scroll *direction*, never by depth alone, and it does not engage in the
first 140px of a page or under reduced motion. The bar's own box changes — never
a transform on its contents, which would soften the type.

## Non-negotiable anti-generic rules

- Do not copy Clear Street, including its exact page structure, dashboard motifs, sentence rhythm, metrics, videos, logos, navigation, or colors as a whole.
- Do not use purple-on-white gradients, beige/terracotta editorial defaults, generic blob art, fake data charts, or repeated floating cards.
- Do not add arbitrary labels, all-caps eyebrows, excessive pill badges, or `01/02/03` numbering except for Løfte's real six-step process.
- Do not invent client names, performance metrics, awards, staff credentials, testimonials, or portfolio results. Clearly mark placeholders in the CMS/content layer.
- Do not use stock photos of office workers merely to fill space. Use supplied portfolio work, abstract signal graphics, purposeful typography, or carefully selected motion stills.
