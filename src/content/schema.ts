import { z } from "zod";

/**
 * Runtime schemas for the content model.
 *
 * These exist for the boundary, not for the inside of the app. Local seed data
 * is already type-checked by TypeScript; what these guard is the moment
 * content starts arriving from Sanity over the network, where TypeScript knows
 * nothing and a renamed field is a runtime crash on a production page.
 *
 * `src/lib/content` validates through these on the way in, so a malformed
 * document fails loudly at the fetch with a field path, rather than quietly
 * rendering an empty section.
 *
 * They mirror `sanity/schemas/*` one-for-one. Change one, change the other.
 */

export const capabilitySlugSchema = z.enum([
  "copy",
  "video",
  "visual",
  "audio",
  "localization",
  "strategy",
]);

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  solves: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  process: z
    .array(z.object({ title: z.string().min(1), detail: z.string().min(1) }))
    .min(1),
  capabilities: z.array(capabilitySlugSchema).min(1),
  faq: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .optional(),
});

export const caseStudySchema = z
  .object({
    slug: z.string().min(1),
    status: z.enum(["reserved", "published"]),
    reservedTitle: z.string().min(1),
    reservedSummary: z.string().min(1),
    title: z.string(),
    client: z.string().optional(),
    sector: z.string().optional(),
    capabilities: z.array(capabilitySlugSchema).min(1),
    challenge: z.string().optional(),
    approach: z.string().optional(),
    deliverables: z.array(z.string()).optional(),
    results: z
      .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
      .optional(),
  })
  // A published case study has to carry the fields a reader expects; a
  // reserved slot must not carry results, because there are none to report.
  .refine((study) => study.status !== "published" || study.title.length > 0, {
    message: "A published case study needs a title.",
    path: ["title"],
  })
  .refine((study) => study.status !== "published" || Boolean(study.challenge), {
    message: "A published case study needs a challenge.",
    path: ["challenge"],
  })
  .refine((study) => study.status !== "reserved" || (study.results ?? []).length === 0, {
    message: "A reserved slot cannot carry results — there is nothing to report yet.",
    path: ["results"],
  });

export const testimonialSchema = z
  .object({
    id: z.string().min(1),
    quote: z.string().min(1),
    attribution: z.string().min(1),
    approved: z.boolean(),
  })
  // The site must never render a quote nobody signed off on.
  .refine((entry) => entry.approved, {
    message: "A testimonial without written approval must not be published.",
    path: ["approved"],
  });

export const clientLogoSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    asset: z.string().optional(),
    approved: z.boolean(),
  })
  .refine((entry) => entry.approved, {
    message: "A client logo without permission must not be published.",
    path: ["approved"],
  });

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), text: z.string().min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
]);

export const insightSchema = z
  .object({
    slug: z.string().min(1),
    status: z.enum(["sample", "published"]),
    title: z.string().min(1),
    standfirst: z.string().min(1),
    category: z.string().min(1),
    date: z.string(),
    author: z.string(),
    body: z.array(blockSchema).min(1),
  })
  .refine((entry) => entry.status !== "published" || entry.date.length > 0, {
    message: "A published note needs a date.",
    path: ["date"],
  })
  .refine((entry) => entry.status !== "published" || entry.author.length > 0, {
    message: "A published note needs an author.",
    path: ["author"],
  });

export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  portrait: z.string().optional(),
  bio: z.string().optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  email: z.string(),
  phone: z.string(),
  legalName: z.string().min(1),
  address: z.string(),
  city: z.string().min(1),
  country: z.string().min(1),
  social: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })),
});

/**
 * Parse a collection, reporting the document that failed rather than just the
 * field. A GROQ result with one bad document should not take the page down
 * without saying which one.
 */
export function parseAll<T>(
  schema: z.ZodType<T>,
  documents: unknown[],
  label: string,
): T[] {
  return documents.map((document, index) => {
    const result = schema.safeParse(document);
    if (!result.success) {
      const detail = result.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid ${label} at index ${index} — ${detail}`);
    }
    return result.data;
  });
}
