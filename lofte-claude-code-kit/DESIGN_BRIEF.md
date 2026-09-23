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

Use GSAP + ScrollTrigger only for significant moments:

1. Hero signal field resolves once on load.
2. The six-step Løfte process progresses as a scroll narrative.
3. Case-study media shifts between clipped editorial frames.
4. Service details expand/collapse because the visitor asks for more detail.

No universal fade-up animation. No continuous decorative parallax. Respect `prefers-reduced-motion`; in that mode, reveal all content normally and remove scroll pinning.

## Non-negotiable anti-generic rules

- Do not copy Clear Street, including its exact page structure, dashboard motifs, sentence rhythm, metrics, videos, logos, navigation, or colors as a whole.
- Do not use purple-on-white gradients, beige/terracotta editorial defaults, generic blob art, fake data charts, or repeated floating cards.
- Do not add arbitrary labels, all-caps eyebrows, excessive pill badges, or `01/02/03` numbering except for Løfte's real six-step process.
- Do not invent client names, performance metrics, awards, staff credentials, testimonials, or portfolio results. Clearly mark placeholders in the CMS/content layer.
- Do not use stock photos of office workers merely to fill space. Use supplied portfolio work, abstract signal graphics, purposeful typography, or carefully selected motion stills.
