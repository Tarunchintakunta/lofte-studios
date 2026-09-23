/**
 * The six real Løfte capabilities. Outcome-led statements — what a client
 * ends up with — rather than a list of tools. No metrics, no claims that
 * cannot be backed up.
 */

export type CapabilitySlug =
  "copy" | "video" | "visual" | "audio" | "localization" | "strategy";

export type Capability = {
  slug: CapabilitySlug;
  name: string;
  /** One sentence. What the client walks away with. */
  outcome: string;
  /** The concrete work behind it. Used on service pages and work filters. */
  includes: string[];
  /** The service group this capability is delivered under. */
  service: string;
};

export const capabilities: Capability[] = [
  {
    slug: "copy",
    name: "Copy",
    outcome:
      "The argument arrives first. Scripts, articles, and editing that leave a reader holding one clear idea instead of five competing ones.",
    includes: ["Content strategy", "Copywriting", "Editing", "Scripting"],
    service: "words-with-direction",
  },
  {
    slug: "video",
    name: "Video",
    outcome:
      "Footage cut for comprehension, then versioned for where it actually plays — including muted, on a phone, with the captions doing the work.",
    includes: ["Video editing", "Storyboards", "Captioning", "Motion assets"],
    service: "motion-made-to-be-understood",
  },
  {
    slug: "visual",
    name: "Visual",
    outcome:
      "A visual language your team can keep using after we leave. Systems and templates, not a folder of one-off files.",
    includes: ["Graphic design", "Infographics", "Illustration", "Presentations"],
    service: "visual-systems-that-carry-the-message",
  },
  {
    slug: "audio",
    name: "Audio",
    outcome:
      "Narration and sound that carry tone as precisely as the words do — recorded, cleaned, and matched to the intent of the script.",
    includes: ["Narration", "Audio cleanup", "Audio localization"],
    service: "sound-with-a-point-of-view",
  },
  {
    slug: "localization",
    name: "Localization",
    outcome:
      "The same meaning in the next market. Transcreation and subtitling that move the idea across, not just the words.",
    includes: ["Transcreation", "Translation", "Subtitling", "Audio localization"],
    service: "words-with-direction",
  },
  {
    slug: "strategy",
    name: "Strategy",
    outcome:
      "Knowing what to make next, and what to stop making. Planning, distribution, and a plain reading of what the work actually did.",
    includes: [
      "Content planning",
      "Distribution",
      "Engagement optimization",
      "Performance analysis",
    ],
    service: "reach-and-refinement",
  },
];

export const capabilityBySlug = (slug: string) =>
  capabilities.find((capability) => capability.slug === slug);
