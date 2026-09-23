import type { CapabilitySlug } from "./capabilities";

/**
 * Services, grouped by outcome rather than by department — the grouping
 * SITE_AND_CONTENT.md asks for. A client arrives with a problem ("nobody
 * understands our product"), not with a purchase order for "copywriting".
 *
 * Every claim here is about method. Nothing asserts a result, a timeline, or a
 * client outcome that has not happened.
 */

export type ServiceSlug =
  | "words-with-direction"
  | "visual-systems-that-carry-the-message"
  | "motion-made-to-be-understood"
  | "sound-with-a-point-of-view"
  | "reach-and-refinement";

export type Service = {
  slug: ServiceSlug;
  title: string;
  /** One line, used in the overview index and page metadata. */
  summary: string;
  /** The problem this group exists to solve, in the client's words. */
  solves: string[];
  deliverables: string[];
  /** How the work actually runs, step by step. */
  process: { title: string; detail: string }[];
  /** Capabilities that feed this group — links the two content models. */
  capabilities: CapabilitySlug[];
  faq?: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "words-with-direction",
    title: "Words with direction",
    summary:
      "Content strategy, copywriting, editing, transcreation, and translation — writing that knows what it is for.",
    solves: [
      "Everything we publish says something slightly different.",
      "Our writing is accurate but nobody finishes reading it.",
      "Our English version works and the other languages do not.",
    ],
    deliverables: [
      "Content strategy and messaging framework",
      "Long-form and short-form copy",
      "Editing and rewriting of existing material",
      "Transcreation and translation",
      "Style guide and tone reference",
    ],
    process: [
      {
        title: "Read everything you already have",
        detail:
          "Decks, docs, support tickets, sales calls. The clearest sentence about a business is usually already written somewhere inside it.",
      },
      {
        title: "Agree the one idea",
        detail:
          "Before any drafting, we write down the single thing a reader should be left holding. Everything after that is judged against it.",
      },
      {
        title: "Draft, cut, and cut again",
        detail:
          "First drafts are for finding the argument. The value is in the second and third pass, where the hedging comes out.",
      },
      {
        title: "Carry it into other languages",
        detail:
          "Transcreation rather than translation where the idea does not survive a literal reading.",
      },
    ],
    capabilities: ["copy", "localization", "strategy"],
    faq: [
      {
        question: "Can you work from our existing material rather than starting over?",
        answer:
          "Usually that is the better option. Most teams have more usable material than they think, and an edit gets to a publishable result faster than a rewrite.",
      },
      {
        question: "Do you write in languages other than English?",
        answer:
          "Yes, through transcreation with native speakers. Which languages depends on the project — tell us the markets and we will tell you what we can cover.",
      },
    ],
  },
  {
    slug: "visual-systems-that-carry-the-message",
    title: "Visual systems that carry the message",
    summary:
      "Graphic design, infographics, illustration, presentations, and social assets built as a system your team can keep using.",
    solves: [
      "Every deck we make looks like it came from a different company.",
      "Our data is interesting and our charts are not.",
      "Design is a bottleneck for every team that needs an asset.",
    ],
    deliverables: [
      "Design system, templates, and component library",
      "Infographics and data visualisation",
      "Illustration and iconography",
      "Presentation design",
      "Social and campaign assets",
    ],
    process: [
      {
        title: "Audit what is in circulation",
        detail:
          "We collect what your team actually sends out, not what the brand guidelines say. The gap between the two is the brief.",
      },
      {
        title: "Set the system",
        detail:
          "Type, colour, spacing, and chart rules, decided once and written down, so the next asset does not reopen the same argument.",
      },
      {
        title: "Build the first assets against it",
        detail:
          "The system is proved by making real work with it, not by a specimen sheet.",
      },
      {
        title: "Hand over editable templates",
        detail:
          "Files your team can open and change, with the rules explained in the file rather than in a separate document nobody opens.",
      },
    ],
    capabilities: ["visual", "strategy"],
    faq: [
      {
        question: "Do you replace our brand guidelines?",
        answer:
          "No. We work inside whatever brand you already have and fill the gaps it leaves for day-to-day content.",
      },
    ],
  },
  {
    slug: "motion-made-to-be-understood",
    title: "Motion made to be understood",
    summary:
      "Scripting, storyboards, video editing, captioning, subtitling, and motion assets — built for where the work actually plays.",
    solves: [
      "Our video looks good and does not explain anything.",
      "We have hours of footage and no idea what to do with it.",
      "The film works in a meeting and dies on social.",
    ],
    deliverables: [
      "Script and storyboard",
      "Edit, grade, and sound mix",
      "Channel versions and aspect-ratio crops",
      "Captions and subtitles",
      "Motion graphics and title systems",
    ],
    process: [
      {
        title: "Write the argument first",
        detail:
          "A script before a shot list. If the point does not survive being read aloud, no amount of editing rescues it.",
      },
      {
        title: "Storyboard the shape",
        detail:
          "Where the attention goes, when the point lands, and what the viewer is looking at while it does.",
      },
      {
        title: "Edit for comprehension",
        detail:
          "Cut against understanding rather than against the music. Then check it muted, because most of the audience will be.",
      },
      {
        title: "Version it for each destination",
        detail:
          "Built for both a wide screen and a phone from the start, rather than exported twice and hoped for.",
      },
    ],
    capabilities: ["video", "copy", "localization"],
    faq: [
      {
        question: "Do you shoot, or only edit?",
        answer:
          "Both, depending on the project. Plenty of the strongest pieces are assembled entirely from material a client already owns.",
      },
      {
        question: "Are captions included?",
        answer:
          "Captions are part of the edit, not an extra. A video that only works with sound on is a video that mostly does not work.",
      },
    ],
  },
  {
    slug: "sound-with-a-point-of-view",
    title: "Sound with a point of view",
    summary:
      "Narration, audio cleanup, and audio localization — so the delivery carries the same intent as the script.",
    solves: [
      "Our voiceover is technically fine and completely flat.",
      "The recording we have is unusable and we cannot reshoot.",
      "We need the same narration in three languages.",
    ],
    deliverables: [
      "Narration and voice direction",
      "Audio restoration and cleanup",
      "Mix and loudness normalisation for each platform",
      "Localized voice tracks",
    ],
    process: [
      {
        title: "Direct the read",
        detail:
          "Tone is a decision, not a byproduct. We mark the script for emphasis before anyone records it.",
      },
      {
        title: "Clean what exists",
        detail:
          "Noise, room, plosives, and inconsistent levels, fixed before anything is judged on performance.",
      },
      {
        title: "Mix for the destination",
        detail:
          "Loudness targets differ by platform, and a mix that is right for one is wrong for another.",
      },
      {
        title: "Localize without flattening",
        detail:
          "A localized read is directed too, rather than handed to a voice artist with a translated file.",
      },
    ],
    capabilities: ["audio", "localization"],
  },
  {
    slug: "reach-and-refinement",
    title: "Reach and refinement",
    summary:
      "Publishing, distribution, engagement optimization, and performance analysis — deciding what to make next, and what to stop.",
    solves: [
      "We publish constantly and cannot tell what is working.",
      "Our best piece got no distribution.",
      "Every report says the numbers are up and nobody can say why.",
    ],
    deliverables: [
      "Content plan and publishing calendar",
      "Channel and distribution plan",
      "Performance review with plain-language findings",
      "Recommendations on what to stop making",
    ],
    process: [
      {
        title: "Agree what would count as working",
        detail:
          "Before publishing, not after. A measure chosen afterwards will always find something flattering to report.",
      },
      {
        title: "Publish deliberately",
        detail:
          "The right cut, in the right place, at a cadence your team can actually sustain.",
      },
      {
        title: "Read the result honestly",
        detail:
          "Including the pieces that did nothing. Those are usually more instructive than the ones that did well.",
      },
      {
        title: "Change the plan",
        detail:
          "A review that does not change what gets made next was not worth running.",
      },
    ],
    capabilities: ["strategy", "copy"],
    faq: [
      {
        question: "Do you guarantee results?",
        answer:
          "No. Anyone who does is guessing. We agree what would count as working before we start, and we report what actually happened.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);
