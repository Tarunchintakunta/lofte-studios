import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { WorkPlate } from "@/components/signal/WorkPlate";
import { BreadcrumbSchema, ServiceSchema } from "@/components/seo/StructuredData";
import { pageMetadata } from "@/lib/metadata";
import { getCaseStudies, getService, getServices } from "@/lib/content";
import { capabilityBySlug } from "@/content/capabilities";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) notFound();

  // Work that touches any of this group's capabilities.
  const caseStudies = await getCaseStudies();
  const related = caseStudies.filter((study) =>
    study.capabilities.some((capability) => service.capabilities.includes(capability)),
  );
  const hasPublishedWork = related.some((study) => study.status === "published");

  return (
    <>
      <ServiceSchema service={service} />
      <BreadcrumbSchema
        trail={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />
      <PageHero
        kicker={<TextLink href="/services">Services</TextLink>}
        title={service.title}
        standfirst={service.summary}
      />

      <Section surface="paper" labelledBy="solves-heading">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="solves-heading" className="text-display-3 font-display">
                What it solves
              </h2>
              <p className="measure text-body text-fg-muted mt-6">
                These are the sentences clients tend to open with. If one of them sounds
                like your team, this is the group to talk to us about.
              </p>
            </div>

            <ul className="lg:col-span-6 lg:col-start-7">
              {service.solves.map((problem) => (
                <li key={problem} className="border-rule border-t py-6 last:border-b">
                  <p className="text-heading-2 font-display text-balance">
                    &ldquo;{problem}&rdquo;
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section surface="ink" labelledBy="process-heading">
        <Container>
          <SectionHead
            id="process-heading"
            heading="How the work runs."
            standfirst="Four movements, in order. They sit inside the wider Løfte method rather than replacing it."
            aside={
              <p className="text-fg-muted">
                <TextLink href="/approach">See the full method</TextLink>
              </p>
            }
          />

          <div className="mt-14 grid gap-x-10 gap-y-10 md:mt-18 md:grid-cols-2">
            {service.process.map((step) => (
              <div key={step.title} className="border-rule border-t pt-6">
                <h3 className="text-heading-1 font-display text-balance">{step.title}</h3>
                <p className="text-body text-fg-muted mt-4">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="border-rule mt-16 grid gap-x-12 gap-y-8 border-t pt-8 lg:grid-cols-12">
            <h2 className="text-heading-1 font-display lg:col-span-4">
              What you receive
            </h2>
            <ul className="lg:col-span-7 lg:col-start-6">
              {service.deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="border-rule text-body flex items-baseline gap-4 border-b py-3.5 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="bg-accent h-[3px] w-[3px] shrink-0 rounded-full"
                  />
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-rule mt-16 grid gap-x-12 gap-y-8 border-t pt-8 lg:grid-cols-12">
            <h2 className="text-heading-1 font-display lg:col-span-4">
              Capabilities behind it
            </h2>
            <ul className="flex flex-wrap gap-2 lg:col-span-7 lg:col-start-6">
              {service.capabilities.map((slug) => {
                const capability = capabilityBySlug(slug);
                if (!capability) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/work?capability=${slug}`}
                      className="border-rule-strong rounded-capsule text-body-sm hover:border-fg block border px-4 py-2 transition-colors duration-[--duration-fast]"
                    >
                      {capability.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      <Section surface="ink" size="tight" labelledBy="service-work-heading">
        <Container>
          <SectionHead
            id="service-work-heading"
            heading="Work from this group."
            aside={
              <p className="text-fg-muted">
                <TextLink href="/work">All selected work</TextLink>
              </p>
            }
          />
          <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2">
            {related.slice(0, 2).map((study, index) => (
              <article key={study.slug}>
                <Link href={`/work/${study.slug}`} className="group block">
                  <div className="border-rule group-hover:border-fg-subtle aspect-[16/10] w-full overflow-hidden border transition-colors duration-[--duration-base]">
                    <WorkPlate seed={index + 4} />
                  </div>
                  <h3 className="text-heading-1 font-display group-hover:text-accent mt-5 transition-colors duration-[--duration-base]">
                    {study.status === "published" ? study.title : study.reservedTitle}
                  </h3>
                </Link>
                <p className="text-body-sm text-fg-muted measure mt-2">
                  {study.status === "published" ? study.challenge : study.reservedSummary}
                </p>
              </article>
            ))}
          </div>
          {!hasPublishedWork ? (
            <PlaceholderNote className="mt-8">
              Reserved slots. Real case studies appear here automatically once they are
              published with client approval.
            </PlaceholderNote>
          ) : null}
        </Container>
      </Section>

      {service.faq && service.faq.length > 0 ? (
        <Section surface="paper" labelledBy="faq-heading">
          <Container>
            <SectionHead id="faq-heading" heading="Questions we get asked." />
            <div className="mt-10 lg:max-w-[52rem]">
              {service.faq.map((entry) => (
                <details
                  key={entry.question}
                  className="border-rule group border-t last:border-b"
                >
                  <summary className="text-heading-2 font-display hover:text-accent flex cursor-pointer list-none items-center justify-between gap-6 py-6 transition-colors duration-[--duration-fast] [&::-webkit-details-marker]:hidden">
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className="border-rule-strong relative h-6 w-6 shrink-0 rounded-full border"
                    >
                      <span className="bg-fg absolute top-1/2 left-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2" />
                      <span className="bg-fg absolute top-1/2 left-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 transition-transform duration-[--duration-base] group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="measure-wide text-body text-fg-muted pb-7">
                    {entry.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <ClosingCta />
    </>
  );
}
