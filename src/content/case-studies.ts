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

/**
 * `sample` entries are demo content with fictional clients. They render like a
 * published piece but carry a visible "Sample" label, are excluded from search
 * indexing and the sitemap, and never carry results. Delete them once real
 * work is published.
 */
export type CaseStudyStatus = "reserved" | "sample" | "published";

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
  /** Path under /public. Falls back to an abstract plate while absent. */
  cover?: string;
  /** Only ever populated from client-supplied, client-approved figures. */
  results?: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "sample-harvest-cooperative",
    status: "sample",
    reservedTitle: "First case study",
    reservedSummary: "Sample.",
    title: "One film, four languages, one argument",
    client: "Meridian Harvest Co-op (fictional)",
    sector: "Agriculture",
    capabilities: ["strategy", "video", "localization"],
    challenge:
      "A farmer-owned cooperative needed to explain a new fair-price scheme to growers across four states. Past campaigns had been translated line by line, and the argument fell apart somewhere between English and the field.",
    approach:
      "We wrote the one sentence every version had to land — you set the floor price, not the middleman — and built the film around it. Scripts were transcreated rather than translated, narration was recorded with regional voices, and every cut was reviewed by growers before lock. The master and three local versions shipped the same week.",
    deliverables: [
      "Message framework and one-line argument",
      "Two-minute documentary-style film",
      "Transcreated scripts in Telugu, Hindi, Kannada, and Marathi",
      "Regional voice-over and burned-in subtitles",
      "Thirty-second vertical cut-downs for messaging apps",
    ],
  },
  {
    slug: "sample-northwind-identity",
    status: "sample",
    reservedTitle: "Second case study",
    reservedSummary: "Sample.",
    title: "A visual system a team kept using",
    client: "Northwind Learning (fictional)",
    sector: "Education",
    capabilities: ["visual", "copy"],
    challenge:
      "An ed-tech company had grown from five people to eighty, and every team was designing its own slides, social posts, and course covers. The brand existed in a PDF that nobody opened.",
    approach:
      "Rather than a thicker guideline, we built the system into the tools the team already used: editable presentation, social, and course-cover templates, a tight palette, two typefaces, and a writing guide short enough to read in one sitting. We ran two working sessions with the in-house team and handed over every source file.",
    deliverables: [
      "Refined palette, type scale, and layout grid",
      "Presentation, social, and course-cover template kits",
      "Illustration and infographic style guide",
      "Four-page voice and writing guide",
      "Two hands-on training sessions",
    ],
  },
  {
    slug: "sample-kestrel-audio",
    status: "sample",
    reservedTitle: "Third case study",
    reservedSummary: "Sample.",
    title: "An onboarding series that speaks the room's language",
    client: "Kestrel Health (fictional)",
    sector: "Healthcare",
    capabilities: ["audio", "localization", "copy"],
    challenge:
      "A clinic network was onboarding frontline staff with a slide deck written for head office. New hires in regional clinics skipped it, and the same safety questions kept coming back.",
    approach:
      "We rewrote the material as a short audio series staff could listen to between shifts, recorded in three languages with clinicians rather than actors reviewing each script for accuracy. Every episode ends with one thing to do differently tomorrow.",
    deliverables: [
      "Eight-episode audio series, five minutes each",
      "Scripts in English, Telugu, and Tamil",
      "Narration, cleanup, and mastering",
      "Printable one-page summary per episode",
    ],
  },
  {
    slug: "reserved-01",
    status: "reserved",
    reservedTitle: "Reserved slot",
    reservedSummary:
      "Reserved for a flagship piece — the project that best shows strategy, production, and localization running as one job.",
    title: "",
    capabilities: ["strategy", "video", "copy"],
  },
];
