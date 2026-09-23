/**
 * Notes (Insights).
 *
 * SITE_AND_CONTENT.md asks that Insights not be promoted into the primary
 * navigation until real articles exist, so `/notes` lives in the footer and
 * renders an honest empty state.
 *
 * One entry is marked `sample`. It exists so the article template is real and
 * reviewable rather than untested code, it is labelled as a sample on the page
 * itself, it carries no byline, and it is excluded from search indexing and
 * from the sitemap. Delete it the moment a real article is written.
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

export const publishedInsights = () =>
  insights.filter((insight) => insight.status === "published");

export const insightBySlug = (slug: string) =>
  insights.find((insight) => insight.slug === slug);
