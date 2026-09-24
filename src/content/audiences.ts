import { capabilityBySlug, type CapabilitySlug } from "@/content/capabilities";

/**
 * Who the studio is for.
 *
 * These are descriptions of fit, not a client list — nobody named here is or
 * claims to be a Løfte client, and none of them carries a result. Each one
 * completes the word "For", which is the whole conceit of the section that
 * renders them.
 *
 * Kept as typed constants alongside `capabilities.ts` rather than going through
 * the content boundary, for the same reason: every item points at a capability
 * in the fixed taxonomy, so an editor renaming one out from under the code
 * would break a link rather than change a word.
 */

export type Audience = {
  /** Reads as the completion of "For …". Sentence case, no trailing period. */
  label: string;
  /** The discipline that usually leads this kind of engagement. */
  lead: CapabilitySlug;
  /** One line, shown as the item takes focus. Plain, and honest about scope. */
  note: string;
};

export const audiences: Audience[] = [
  {
    label: "High-growth founders",
    lead: "strategy",
    note: "One narrative to raise on, hire on, and sell on — before it fragments.",
  },
  {
    label: "Venture-backed startups",
    lead: "video",
    note: "A launch film that still works muted, on a phone, at a third of its length.",
  },
  {
    label: "Design-led tech brands",
    lead: "visual",
    note: "A visual system your own team can keep extending after we leave.",
  },
  {
    label: "Enterprise product studios",
    lead: "copy",
    note: "Complicated products explained once, properly, instead of ten times badly.",
  },
  {
    label: "Corporate innovators",
    lead: "strategy",
    note: "The internal case and the external story, built from the same argument.",
  },
  {
    label: "Global creative directors",
    lead: "localization",
    note: "The same idea in the next market — directed, not dubbed.",
  },
  {
    label: "Emerging category leaders",
    lead: "copy",
    note: "Language for a category that does not have its vocabulary yet.",
  },
  {
    label: "Teams entering a second market",
    lead: "localization",
    note: "Transcreation and subtitling that move the meaning, not just the words.",
  },
  {
    label: "In-house marketing leads",
    lead: "video",
    note: "More footage than time, and a calendar that will not wait for either.",
  },
];

/**
 * Where an audience leads. Every item resolves to a real service page through
 * the capability taxonomy, so the reel can never link somewhere that does not
 * exist — and if the taxonomy ever moves, the link degrades to the index
 * rather than shipping an empty `href`.
 */
export function audienceRoute(audience: Audience): string {
  const capability = capabilityBySlug(audience.lead);
  return capability ? `/services/${capability.service}` : "/services";
}

/** The discipline's display name, for the label shown beside a focused item. */
export function audienceLead(audience: Audience): string {
  return capabilityBySlug(audience.lead)?.name ?? "Services";
}
