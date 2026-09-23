import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
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
          <ButtonLink href={cta.primary.href} variant="outline">
            {cta.primary.label}
          </ButtonLink>
        }
      />

      <Section surface="paper" size="tight">
        <Container>
          <ul>
            {services.map((service, index) => (
              <li key={service.slug} className="border-rule border-t last:border-b">
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "group grid gap-x-10 gap-y-4 py-9 md:grid-cols-12 md:py-12",
                    "transition-colors duration-[--duration-base]",
                  )}
                >
                  <span className="text-body-sm text-fg-subtle font-sans tabular-nums md:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="md:col-span-5">
                    <span className="font-display text-display-3 group-hover:text-accent block transition-colors duration-[--duration-base]">
                      {service.title}
                    </span>
                  </span>
                  <span className="text-body text-fg-muted md:col-span-6">
                    {service.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
