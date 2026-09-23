import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { WorkPlate } from "@/components/signal/WorkPlate";
import { getCaseStudies } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Selected work.
 *
 * Asymmetric on purpose: the first piece runs wide, the next two share the
 * row. A uniform grid of equal cards is exactly what DESIGN_BRIEF.md rules
 * out, and it would also flatten a portfolio where the pieces are not equally
 * important.
 *
 * With no approved case studies yet, the slots render as reserved plates with
 * one honest note at section level — not three invented clients.
 */
export async function SelectedWork() {
  const caseStudies = await getCaseStudies();
  const published = caseStudies.filter((study) => study.status === "published");
  const slots = published.length > 0 ? published : caseStudies;
  const isReserved = published.length === 0;

  return (
    <Section surface="ink" id="work" labelledBy="work-heading">
      <Container>
        <SectionHead
          id="work-heading"
          heading="Selected work."
          standfirst="Pieces are published here once the client has approved the work, the credit, and the result being shown."
          aside={
            <p className="text-body-sm text-fg-muted">
              <TextLink href="/work">Browse everything</TextLink>
            </p>
          }
        />

        <div className="mt-12 grid gap-x-8 gap-y-12 md:mt-16 lg:grid-cols-12">
          {slots.slice(0, 3).map((study, index) => (
            <article
              key={study.slug}
              className={cn(
                "group",
                // First piece runs wide; the pair below share the row.
                index === 0 ? "lg:col-span-12" : "lg:col-span-6",
              )}
            >
              <Link href={`/work/${study.slug}`} className="block">
                <div
                  className={cn(
                    "border-rule group-hover:border-fg-subtle w-full overflow-hidden",
                    "border transition-colors duration-[--duration-base]",
                    index === 0 ? "aspect-[16/7]" : "aspect-[16/10]",
                  )}
                >
                  <WorkPlate seed={index + 1} ratio={index === 0 ? "wide" : "standard"} />
                </div>
                <h3
                  className={cn(
                    "font-display group-hover:text-accent mt-5 transition-colors",
                    "duration-[--duration-base]",
                    index === 0 ? "text-display-3" : "text-heading-1",
                  )}
                >
                  {isReserved ? study.reservedTitle : study.title}
                </h3>
              </Link>

              <div className="mt-2 flex flex-col gap-2">
                <p className="text-body-sm text-fg-muted measure">
                  {isReserved ? study.reservedSummary : study.challenge}
                </p>
                <p className="text-micro text-fg-subtle">
                  {study.capabilities
                    .map((c) => c[0].toUpperCase() + c.slice(1))
                    .join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </div>

        {isReserved ? (
          <PlaceholderNote className="mt-10">
            Three slots are reserved above. The plates are abstract by design — no
            invented client, sector, or result appears anywhere on this site. Supply three
            to six approved case studies and these fill in without a layout change.
          </PlaceholderNote>
        ) : null}
      </Container>
    </Section>
  );
}
