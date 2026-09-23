import type { CapabilitySlug } from "./capabilities";

/**
 * Case studies.
 *
 * Nothing in here is a real Løfte engagement. Every entry is `reserved`: a
 * slot that holds the shape of a case study — sector, capabilities, the fields
 * a real piece will carry — without inventing a client, a brief, or a result.
 *
 * To publish a real one: fill `title`, `client`, `sector`, `challenge`,
 * `approach`, `deliverables`, and set `status: "published"`. Results only go in
 * when the client has supplied and approved the numbers. The listing and the
 * homepage both switch from reserved plates to real work automatically.
 */

export type CaseStudyStatus = "reserved" | "published";

export type CaseStudy = {
  slug: string;
  status: CaseStudyStatus;
  /** Shown while `status` is "reserved". */
  reservedTitle: string;
  reservedSummary: string;

  title: string;
  /** Optional: some clients approve the work but not the name. */
  client?: string;
  sector?: string;
  capabilities: CapabilitySlug[];
  challenge?: string;
  approach?: string;
  deliverables?: string[];
  /** Only ever populated from client-supplied, client-approved figures. */
  results?: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "reserved-01",
    status: "reserved",
    reservedTitle: "First case study",
    reservedSummary:
      "Reserved for a flagship piece — the project that best shows strategy, production, and localization running as one job.",
    title: "",
    capabilities: ["strategy", "video", "copy"],
  },
  {
    slug: "reserved-02",
    status: "reserved",
    reservedTitle: "Second case study",
    reservedSummary:
      "Reserved for a visual systems piece: a design language a client team carried on using after handover.",
    title: "",
    capabilities: ["visual", "copy"],
  },
  {
    slug: "reserved-03",
    status: "reserved",
    reservedTitle: "Third case study",
    reservedSummary:
      "Reserved for a localization piece: one story delivered into more than one market without losing its argument.",
    title: "",
    capabilities: ["localization", "audio", "video"],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);

export const publishedCaseStudies = () =>
  caseStudies.filter((study) => study.status === "published");
