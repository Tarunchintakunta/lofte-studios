import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";
import { getInsight, getInsights } from "@/lib/content";

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const insight = await getInsight(slug);
  if (!insight) return {};

  return pageMetadata({
    title: insight.title,
    description: insight.standfirst,
    path: `/notes/${insight.slug}`,
    type: "article",
    noIndex: insight.status === "sample",
  });
}

export default async function NotePage(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const related = (await getInsights())
    .filter((other) => other.status === "published" && other.slug !== insight.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        kicker={<TextLink href="/notes">Notes</TextLink>}
        title={insight.title}
        standfirst={insight.standfirst}
        aside={
          <dl className="flex flex-col gap-4">
            <div>
              <dt className="text-micro text-fg-subtle">Category</dt>
              <dd className="text-body-sm mt-1">{insight.category}</dd>
            </div>
            {insight.date ? (
              <div>
                <dt className="text-micro text-fg-subtle">Published</dt>
                <dd className="text-body-sm mt-1">
                  <time dateTime={insight.date}>{formatDate(insight.date)}</time>
                </dd>
              </div>
            ) : null}
            {insight.author ? (
              <div>
                <dt className="text-micro text-fg-subtle">Written by</dt>
                <dd className="text-body-sm mt-1">{insight.author}</dd>
              </div>
            ) : null}
          </dl>
        }
      />

      <Section surface="paper" size="none" className="pb-(--spacing-section)">
        <Container>
          {insight.status === "sample" ? (
            <PlaceholderNote className="mb-12">
              A template sample, not a published Løfte note. It has no byline or date and
              is excluded from search indexing and the sitemap.
            </PlaceholderNote>
          ) : null}

          <article className="measure-wide border-rule border-t pt-10">
            {insight.body.map((block, index) => {
              const key = `${block.type}-${index}`;
              if (block.type === "h2") {
                return (
                  <h2 key={key} className="text-display-3 font-display mt-12 first:mt-0">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={key}
                    className="border-accent text-heading-1 font-display my-10 border-l-2 pl-6 text-balance"
                  >
                    {block.text}
                  </blockquote>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={key} className="mt-6 flex flex-col gap-3">
                    {block.items.map((item) => (
                      <li key={item} className="text-body text-fg-muted flex gap-4">
                        <span
                          aria-hidden="true"
                          className="bg-accent mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={key} className="text-body-lg text-fg-muted mt-6 first:mt-0">
                  {block.text}
                </p>
              );
            })}
          </article>

          {related.length > 0 ? (
            <div className="border-rule mt-16 border-t pt-8">
              <h2 className="text-heading-1 font-display">More notes</h2>
              <ul className="mt-5">
                {related.map((other) => (
                  <li key={other.slug} className="border-rule border-b">
                    <TextLink href={`/notes/${other.slug}`} className="block py-4">
                      {other.title}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
