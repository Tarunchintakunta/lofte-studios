/**
 * About content.
 *
 * The studio story and working principles are written in Løfte's own voice and
 * make no claim that cannot be kept. `team` is empty: names, roles, and
 * portraits are the studio's to supply, and the About page hides the section
 * entirely rather than inventing people.
 */

export type Principle = { title: string; detail: string };

export const principles: Principle[] = [
  {
    title: "The argument before the artefact",
    detail:
      "We will not start designing or filming until we can say, in one sentence, what a person should be left holding. If that sentence is hard to write, the project is not ready and more production will not fix it.",
  },
  {
    title: "One team, all the way through",
    detail:
      "The people who set the direction are the people who carry it out. Nothing is thrown over a wall to a vendor who was not in the room when the decision was made.",
  },
  {
    title: "Built for where it lands",
    detail:
      "A film that holds a room fails on a phone with the sound off. We decide the destination first and build for it, rather than exporting a master and hoping.",
  },
  {
    title: "We report what happened",
    detail:
      "Including the pieces that did nothing. A review that only finds good news is not a review, and it makes the next project worse.",
  },
  {
    title: "You keep the working files",
    detail:
      "Project files, source assets, and editable templates are handed over as standard. Lock-in is not a business model we are interested in.",
  },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Path under /public. The card renders initials while this is absent. */
  portrait?: string;
  bio?: string;
};

/**
 * PLACEHOLDER — empty by design. Supply real names, roles, and portraits and
 * the About page grows a team section. Until then it shows nothing.
 */
export const team: TeamMember[] = [];
