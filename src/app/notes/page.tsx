import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { pageMetadata } from "@/lib/metadata";
import { getInsights } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Notes",
  description:
    "Occasional writing from Løfte Studios on content, craft, and the decisions behind the work.",
  path: "/notes",
});

export default async function NotesPage() {
  const insights = await getInsights();
  const published = insights.filter((insight) => insight.status === "published");
  const samples = insights.filter((insight) => insight.status === "sample");

  return (
    <>
      <PageHero
        title="Notes."
        standfirst="Occasional writing on content, craft, and the decisions behind the work. We publish when there is something worth saying rather than to a calendar."
      />

      <Section surface="ink" size="none" className="pb-(--spacing-section)">
        <Container>
          {published.length > 0 ? (
            <ul className="border-rule border-t">
              {published.map((insight) => (
                <li key={insight.slug} className="border-rule border-b">
                  <Link
                    href={`/notes/${insight.slug}`}
                    className="group grid gap-x-10 gap-y-3 py-8 md:grid-cols-12 md:py-10"
                  >
                    <span className="text-micro text-fg-subtle md:col-span-2">
                      {insight.category}
                    </span>
                    <span className="md:col-span-7">
                      <span className="font-display text-heading-1 group-hover:text-accent block text-balance transition-colors duration-[--duration-base]">
                        {insight.title}
                      </span>
                      <span className="text-body-sm text-fg-muted measure mt-2 block">
                        {insight.standfirst}
                      </span>
                    </span>
                    <span className="text-micro text-fg-subtle md:col-span-2 md:col-start-11 md:text-right">
                      {formatDate(insight.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-rule border-t pt-8">
              <p className="measure-wide text-body-lg">Nothing published yet.</p>
              <p className="measure-wide text-body text-fg-muted mt-4">
                Notes is deliberately absent from the main navigation until there is
                something here worth navigating to. When the first note goes up, it moves
                into the nav.
              </p>
            </div>
          )}

          {samples.length > 0 ? (
            <div className="mt-14">
              <h2 className="text-heading-2 font-display">Template sample</h2>
              <ul className="border-rule mt-5 border-t">
                {samples.map((insight) => (
                  <li key={insight.slug} className="border-rule border-b">
                    <Link
                      href={`/notes/${insight.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <span className="text-body group-hover:text-accent transition-colors duration-[--duration-fast]">
                        {insight.title}
                      </span>
                      <span className="text-micro text-fg-subtle shrink-0">
                        Not a published note
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <PlaceholderNote className="mt-6">
                The article template is built and reviewable through the sample above. It
                carries no byline or date, is excluded from search indexing and the
                sitemap, and should be deleted once a real note exists.
              </PlaceholderNote>
            </div>
          ) : null}
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
