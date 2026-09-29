/**
 * Notes (Insights).
 *
 * SITE_AND_CONTENT.md asks that Insights not be promoted into the primary
 * navigation until real articles exist, so `/notes` lives in the footer and
 * renders an honest empty state.
 *
 * Entries marked `sample` are demo notes written in the studio's voice so the
 * section can be reviewed at real length. Each is labelled as a sample on the
 * page, carries no byline or date, and is excluded from search indexing and
 * the sitemap. Replace them as real articles are written.
 */

export type InsightStatus = "sample" | "published";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Insight = {
  slug: string;
  status: InsightStatus;
  title: string;
  standfirst: string;
  category: string;
  /** ISO date. Empty for the sample, which has no publication date. */
  date: string;
  /** Empty until a real author is attributed. */
  author: string;
  body: Block[];
};

export const insights: Insight[] = [
  {
    slug: "the-one-sentence-brief",
    status: "sample",
    title: "The one-sentence brief",
    standfirst:
      "Before a frame is shot or a page is laid out, we ask for one sentence: what should a person be left holding? Most projects that go wrong skipped it.",
    category: "Strategy",
    date: "",
    author: "",
    body: [
      {
        type: "p",
        text: "Every brief arrives with more in it than any single piece of content can carry. That is not a flaw in the brief; it is what happens when several people who care about a project each add the thing they care about most. The job of the first conversation is to find the one idea underneath all of it.",
      },
      { type: "h2", text: "Why one sentence" },
      {
        type: "p",
        text: "A sentence is short enough that everyone can hold it in their head during a review, and specific enough that you can test a draft against it. If a scene, a line of copy, or a chart does not serve the sentence, it is a candidate for the cut, however good it is on its own.",
      },
      {
        type: "quote",
        text: "If the sentence is hard to write, the project is not ready — and more production will not fix it.",
      },
      { type: "h2", text: "What a good one looks like" },
      {
        type: "list",
        items: [
          "It names the audience, even if only implicitly.",
          "It describes a change in what someone knows, believes, or does.",
          "It survives being read aloud to someone outside the project.",
        ],
      },
      {
        type: "p",
        text: "Once it exists, format decisions get easier. Sometimes the sentence wants a two-minute film. Often it wants a rewritten page and a clearer chart, which is cheaper and works harder.",
      },
    ],
  },
  {
    slug: "transcreation-not-translation",
    status: "sample",
    title: "Transcreation is not a fancier word for translation",
    standfirst:
      "Translating a script line by line keeps the words and loses the argument. Moving a story into a new market means rebuilding it from the idea outwards.",
    category: "Localization",
    date: "",
    author: "",
    body: [
      {
        type: "p",
        text: "A literal translation can be perfectly accurate and still fail. Idioms flatten, jokes land nowhere, and the rhythm that made a line memorable in one language turns into a sentence nobody would say out loud in the next.",
      },
      { type: "h2", text: "Start from the argument" },
      {
        type: "p",
        text: "Transcreation starts from the same one-sentence brief as the original and asks how a native writer would make that point to their own audience. The examples change, the order sometimes changes, and occasionally the visuals change with them.",
      },
      {
        type: "list",
        items: [
          "Brief the local writer on the idea, not just the script.",
          "Record narration with voices the audience recognises as their own.",
          "Review with people from the market before picture lock, not after.",
        ],
      },
      {
        type: "quote",
        text: "The test is simple: would someone in that market believe this was written for them first?",
      },
      {
        type: "p",
        text: "It takes a little longer than translation. It also means the version in the fourth language works as hard as the one in the first.",
      },
    ],
  },
  {
    slug: "designing-for-sound-off",
    status: "sample",
    title: "Designing for sound off",
    standfirst:
      "Most video is first seen muted, on a phone, while someone is doing something else. That is not an edge case; it is the brief.",
    category: "Video",
    date: "",
    author: "",
    body: [
      {
        type: "p",
        text: "A film cut for a cinema screen and a room full of attentive people will quietly fail in a feed. The first three seconds carry no sound, the frame is a vertical strip, and the viewer is deciding whether to keep scrolling.",
      },
      { type: "h2", text: "Captions do the talking" },
      {
        type: "p",
        text: "We write captions as part of the edit rather than adding them at the end. They are timed to the cut, sized for a small screen, and edited for reading speed, so the argument survives with the sound off.",
      },
      { type: "h2", text: "Cut for the destination" },
      {
        type: "list",
        items: [
          "Decide where the piece will play before the first edit.",
          "Frame key action inside the safe area for every crop you will need.",
          "Put the point in the first frame, not the last.",
        ],
      },
      {
        type: "p",
        text: "None of this makes the long version worse. It just means the version most people actually see was designed on purpose.",
      },
    ],
  },
  {
    slug: "what-a-note-looks-like",
    status: "sample",
    title: "What a note looks like",
    standfirst:
      "A working sample of the article template: headings, body copy, a pull quote, and a list, at the measure and scale the real thing will use.",
    category: "Craft",
    date: "",
    author: "",
    body: [
      {
        type: "p",
        text: "This page exists so the article template can be reviewed at real length rather than guessed at. Nothing here is a published Løfte position, and the page is excluded from search indexing and from the sitemap until a real note replaces it.",
      },
      { type: "h2", text: "Body copy at the reading measure" },
      {
        type: "p",
        text: "Long-form reading is the one place on this site where the layout gets out of the way entirely. The column is capped near sixty-eight characters, the leading is looser than it is in the interface, and nothing competes with the text for attention in the margins.",
      },
      {
        type: "p",
        text: "Links inside a paragraph draw their underline rather than carrying one permanently, which keeps a dense paragraph readable while still marking every link clearly on hover and on focus.",
      },
      { type: "h2", text: "A list, when a list is the honest shape" },
      {
        type: "list",
        items: [
          "Lists earn their place when the items genuinely do not have an order.",
          "When they do have an order, they belong in prose or in a numbered sequence.",
          "A list of three adjectives is a paragraph that lost its nerve.",
        ],
      },
      {
        type: "quote",
        text: "A pull quote should be a sentence the reader would have underlined anyway, not a decorative restatement of the heading above it.",
      },
      {
        type: "p",
        text: "The template supports a category, a date, and an author. All three are empty on this sample, because it does not have any.",
      },
    ],
  },
];
