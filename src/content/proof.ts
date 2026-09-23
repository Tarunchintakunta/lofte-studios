/**
 * Proof: client logos and testimonials.
 *
 * Both lists are empty, and that is the correct state until the studio has
 * written approval for each entry. DESIGN_BRIEF.md forbids invented client
 * names, results, and testimonials, so nothing is seeded here — not even as an
 * example. The Proof section renders an honest empty state while these are
 * empty and switches to real content the moment they are not.
 */

export type ClientLogo = {
  id: string;
  name: string;
  /** Path under /public. Required before a logo can be displayed. */
  asset?: string;
  /** Written permission on file. A logo without this must not be rendered. */
  approved: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  /** Name, role, company — as the client approved it. */
  attribution: string;
  approved: boolean;
};

export const clientLogos: ClientLogo[] = [];

export const testimonials: Testimonial[] = [];
