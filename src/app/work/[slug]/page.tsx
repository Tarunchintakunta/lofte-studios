import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { WorkPlate } from "@/components/signal/WorkPlate";
import { pageMetadata } from "@/lib/metadata";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { capabilities } from "@/content/capabilities";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const study = await getCaseStudy(slug);
  if (!study) return {};

  const isReserved = study.status === "reserved";
  return pageMetadata({
    title: isReserved ? study.reservedTitle : study.title,
    description: isReserved ? study.reservedSummary : (study.challenge ?? ""),
    path: `/work/${study.slug}`,
    type: "article",
    // A reserved slot is a real URL with no real content behind it. It should
    // not be indexed until a case study is actually published into it.
    noIndex: isReserved,
  });
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const isReserved = study.status === "reserved";
  const capabilityNames = study.capabilities
    .map((s) => capabilities.find((c) => c.slug === s)?.name)
    .filter(Boolean) as string[];

  return (
    <>
      <PageHero
        kicker={<TextLink href="/work">Selected work</TextLink>}
        title={isReserved ? study.reservedTitle : study.title}
        standfirst={isReserved ? study.reservedSummary : study.challenge}
        aside={
          <dl className="flex flex-col gap-4">
            {study.client ? (
              <div>
                <dt className="text-micro text-fg-subtle">Client</dt>
                <dd className="text-body-sm mt-1">{study.client}</dd>
              </div>
            ) : null}
            {study.sector ? (
              <div>
                <dt className="text-micro text-fg-subtle">Sector</dt>
                <dd className="text-body-sm mt-1">{study.sector}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-micro text-fg-subtle">Capabilities</dt>
              <dd className="text-body-sm mt-1">{capabilityNames.join(" · ")}</dd>
            </div>
          </dl>
        }
      >
        <div className="border-rule mt-14 aspect-[16/8] w-full overflow-hidden border md:mt-18">
          <WorkPlate seed={study.slug.length + 3} ratio="wide" />
        </div>
        {isReserved ? (
          <PlaceholderNote className="mt-6">
            This is a reserved slot, not a project. The plate above is abstract by design,
            and the page is excluded from search indexing until a real case study is
            published into it.
          </PlaceholderNote>
        ) : null}
      </PageHero>

      <Section surface="ink" size="tight">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {isReserved ? (
                <>
                  <h2 className="text-display-3 font-display">What goes here</h2>
                  <p className="measure-wide text-body text-fg-muted mt-6">
                    A case study on this site carries the challenge in the client&rsquo;s
                    own framing, the approach we took and why, the deliverables that came
                    out of it, and a gallery of the actual work. Results appear only when
                    the client supplies and approves the figures — we do not estimate
                    them, and we do not publish a number we cannot source.
                  </p>
                  <p className="measure-wide text-body text-fg-muted mt-5">
                    Until then this slot stays visibly empty. See{" "}
                    <TextLink href="/services">what we do</TextLink> or{" "}
                    <TextLink href="/contact">start a project</TextLink>.
                  </p>
                </>
              ) : (
                <>
                  {study.approach ? (
                    <>
                      <h2 className="text-display-3 font-display">Approach</h2>
                      <p className="measure-wide text-body text-fg-muted mt-6">
                        {study.approach}
                      </p>
                    </>
                  ) : null}

                  {study.deliverables && study.deliverables.length > 0 ? (
                    <>
                      <h2 className="text-heading-1 font-display mt-12">Deliverables</h2>
                      <ul className="mt-5">
                        {study.deliverables.map((item) => (
                          <li
                            key={item}
                            className="border-rule text-body border-b py-3 last:border-b-0"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {study.results && study.results.length > 0 ? (
                    <>
                      <h2 className="text-heading-1 font-display mt-12">Results</h2>
                      <dl className="mt-5 grid gap-6 sm:grid-cols-2">
                        {study.results.map((result) => (
                          <div key={result.label} className="border-rule border-t pt-4">
                            <dt className="text-body-sm text-fg-muted">{result.label}</dt>
                            <dd className="text-display-3 font-display mt-2">
                              {result.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="text-micro text-fg-subtle mt-4">
                        Figures supplied and approved by the client.
                      </p>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
