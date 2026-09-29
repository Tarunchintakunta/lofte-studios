import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { getServices } from "@/lib/content";
import { cta } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Løfte Studios groups its work by outcome: words with direction, visual systems, motion made to be understood, sound with a point of view, and reach and refinement.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        title="Grouped by what you need, not by what we do."
        standfirst="Clients arrive with a problem, not a purchase order. These five groups are the problems we are usually brought in to solve."
        aside={
          <ButtonLink href={cta.primary.href} size="lg">
            {cta.primary.label}
          </ButtonLink>
        }
      />

      <Section surface="chalk" size="none" className="pb-(--spacing-section)">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => (
              <Reveal
                as="li"
                key={service.slug}
                delay={(index % 2) * 100}
                className={cn(
                  index === services.length - 1 && index % 2 === 0 && "md:col-span-2",
                )}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group bg-paper flex h-full min-h-[20rem] flex-col rounded-[2rem] p-8 transition-colors duration-[--duration-base] hover:bg-[--color-paper-deep] md:p-10"
                >
                  <span className="text-body text-accent font-semibold tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-display-3 font-display mt-6 block font-semibold tracking-[-0.03em] text-balance">
                    {service.title}
                  </span>
                  <span className="text-body-lg text-fg-muted mt-4 block max-w-xl">
                    {service.summary}
                  </span>
                  <span className="text-body-sm text-accent mt-auto pt-8 font-semibold">
                    Learn more
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block transition-transform duration-[--duration-base] group-hover:translate-x-1"
                    >
                      ›
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
