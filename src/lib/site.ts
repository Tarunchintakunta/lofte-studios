/**
 * Global site configuration.
 *
 * Anything here marked PLACEHOLDER is not a real Løfte business fact. It is
 * registered in `src/lib/placeholders.ts` and surfaces in LAUNCH_CHECKLIST.md.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export type SiteConfig = {
  name: string;
  asciiName: string;
  tagline: string;
  description: string;
  locale: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  legalName: string;
  address: string;
  social: { label: string; href: string }[];
};

export const site: SiteConfig = {
  name: "Løfte Studios",
  /** Used where the ø would be mangled (file names, schema fallbacks). */
  asciiName: "Lofte Studios",
  tagline: "Stories that move brands forward.",
  description:
    "Løfte Studios is a Hyderabad creative-production and digital-storytelling partner, shaping clear, culturally fluent content across words, motion, sound, and visual systems.",
  locale: "en_IN",
  city: "Hyderabad",
  country: "India",

  /** PLACEHOLDER — replace with the approved studio inbox before launch. */
  email: "hello@example.com",
  /** PLACEHOLDER — replace or delete. Nothing renders if left empty. */
  phone: "",
  /** PLACEHOLDER — legal entity name for the footer and Organization schema. */
  legalName: "Løfte Studios",
  /** PLACEHOLDER — postal address. Omitted from the page while empty. */
  address: "",

  /** PLACEHOLDER — no social accounts confirmed yet. */
  social: [],
};

export type NavItem = {
  label: string;
  href: string;
  /** Short line shown under the label in the mobile menu. */
  hint?: string;
};

/**
 * Primary navigation.
 *
 * `Insights` is deliberately absent: SITE_AND_CONTENT.md asks that it not be a
 * prominent nav item until real articles exist. It lives in the footer as
 * "Notes" and is promoted here once the studio publishes.
 */
export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services", hint: "What we make, grouped by outcome" },
  { label: "Selected work", href: "/work", hint: "Case studies across six capabilities" },
  { label: "Our approach", href: "/approach", hint: "The six-step Løfte method" },
  { label: "About", href: "/about", hint: "Who we are and how we work" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Studio",
    items: [
      { label: "Services", href: "/services" },
      { label: "Selected work", href: "/work" },
      { label: "Our approach", href: "/approach" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Notes", href: "/notes" },
      { label: "Start a project", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const cta = {
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "See selected work", href: "/work" },
} as const;
