/**
 * The Løfte method — the one legitimate numbered sequence on this site.
 * DESIGN_BRIEF.md rules out 01/02/03 numbering anywhere else.
 */

export type MethodStep = {
  index: number;
  name: string;
  /** The promise of the step, in the studio's own voice. */
  summary: string;
  /** What actually happens, concretely. */
  detail: string;
};

export const methodSteps: MethodStep[] = [
  {
    index: 1,
    name: "Discover",
    summary: "Start with what already exists.",
    detail:
      "Your material, your audience, and the thing you actually need people to understand. Most projects arrive with more raw content than anyone realises, and a clearer goal than the brief admits.",
  },
  {
    index: 2,
    name: "Design",
    summary: "Decide the shape before the production.",
    detail:
      "Structure, tone, and the format that fits where the work will be seen. This is where a project stops being a list of deliverables and becomes an argument with an order to it.",
  },
  {
    index: 3,
    name: "Develop",
    summary: "Make it, in one room.",
    detail:
      "Writing, filming, designing, recording. The same team that set the direction carries it out, so the intent does not get renegotiated at every handoff.",
  },
  {
    index: 4,
    name: "Distribute",
    summary: "Cut it for where it lands.",
    detail:
      "Versioned, captioned, and sized per channel. A film that holds a room will fail on a phone with the sound off, so it gets built for both rather than exported twice.",
  },
  {
    index: 5,
    name: "Deconstruct",
    summary: "Read what happened, honestly.",
    detail:
      "Which parts carried, which parts were skipped, and what that tells us about the next piece. We would rather report a flat result than dress one up.",
  },
  {
    index: 6,
    name: "Deliver",
    summary: "Hand over the working parts.",
    detail:
      "Final files, organised, with the project files, source assets, and templates behind them — so your team can keep going without booking us again.",
  },
];
