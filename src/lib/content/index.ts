import { services as seedServices, type Service } from "@/content/services";
import { caseStudies as seedCaseStudies, type CaseStudy } from "@/content/case-studies";
import { insights as seedInsights, type Insight } from "@/content/insights";
import {
  clientLogos as seedLogos,
  testimonials as seedTestimonials,
  type ClientLogo,
  type Testimonial,
} from "@/content/proof";
import { team as seedTeam, type TeamMember } from "@/content/about";
import {
  caseStudySchema,
  clientLogoSchema,
  insightSchema,
  parseAll,
  serviceSchema,
  teamMemberSchema,
  testimonialSchema,
} from "@/content/schema";

/**
 * The content boundary.
 *
 * Every page reads content through this module and nothing else. Today it
 * returns the local seed in `src/content/`; when Sanity is configured, the
 * GROQ queries go here and no page changes.
 *
 * Three things make that swap cheap:
 *
 *  1. Every accessor is already `async`, so pages are written to await
 *     content and will not need restructuring when it becomes a fetch.
 *  2. Everything is parsed through `src/content/schema.ts` on the way out, so
 *     the runtime shape is guaranteed whichever source it came from. Running
 *     the seed through the same validation means the schemas are exercised on
 *     every build rather than first meeting real data in production.
 *  3. `isCmsConfigured` is the only branch. Add the Sanity client behind it.
 *
 * The six capabilities are deliberately NOT in here. They are the studio's
 * fixed taxonomy — the filters, the form's checkboxes, the service groupings
 * all key off them — so they stay as typed constants rather than becoming
 * editable content that could be renamed out from under the code.
 */

export const isCmsConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export async function getServices(): Promise<Service[]> {
  // When Sanity is wired: fetch, then hand the result to the same parseAll.
  return parseAll(serviceSchema, seedServices, "service") as Service[];
}

export async function getService(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((service) => service.slug === slug);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return parseAll(caseStudySchema, seedCaseStudies, "case study") as CaseStudy[];
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const all = await getCaseStudies();
  return all.find((study) => study.slug === slug);
}

export async function getInsights(): Promise<Insight[]> {
  return parseAll(insightSchema, seedInsights, "insight") as Insight[];
}

export async function getInsight(slug: string): Promise<Insight | undefined> {
  const all = await getInsights();
  return all.find((insight) => insight.slug === slug);
}

/**
 * Approved proof only.
 *
 * The schemas reject an unapproved entry outright, so this filters first
 * rather than parsing and throwing: an editor ticking "not approved" in the
 * CMS should make a logo disappear from the site, not break the build.
 */
export async function getClientLogos(): Promise<ClientLogo[]> {
  const approved = seedLogos.filter((logo) => logo.approved);
  return parseAll(clientLogoSchema, approved, "client logo") as ClientLogo[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const approved = seedTestimonials.filter((entry) => entry.approved);
  return parseAll(testimonialSchema, approved, "testimonial") as Testimonial[];
}

export async function getTeam(): Promise<TeamMember[]> {
  return parseAll(teamMemberSchema, seedTeam, "team member") as TeamMember[];
}
