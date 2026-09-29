import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { WorkCard } from "@/components/work/WorkCard";
import { Reveal } from "@/components/ui/Reveal";
import { getCaseStudies } from "@/lib/content";

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
  const samples = caseStudies.filter((study) => study.status === "sample");
  const slots =
    published.length > 0 ? published : samples.length > 0 ? samples : caseStudies;
  const isReserved = published.length === 0;

  return (
    <Section surface="paper" id="work" labelledBy="work-heading">
      <Container>
        <Reveal>
          <SectionHead
            align="center"
            id="work-heading"
            heading="Selected work."
            standfirst="Pieces are published here once the client has approved the work, the credit, and the result being shown."
            aside={
              <TextLink href="/work" className="font-semibold">
                Browse everything ›
              </TextLink>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-12 md:mt-16 lg:grid-cols-12">
          {slots.slice(0, 3).map((study, index) => (
            <Reveal
              key={study.slug}
              delay={index === 2 ? 120 : 0}
              className={index === 0 ? "lg:col-span-12" : "lg:col-span-6"}
            >
              <WorkCard
                study={study}
                seed={index + 1}
                headingLevel={3}
                // The first piece runs wide; the pair below share the row.
                size={index === 0 ? "wide" : "standard"}
              />
            </Reveal>
          ))}
        </div>

        {isReserved ? (
          <PlaceholderNote className="mt-10">
            The pieces above are samples with fictional clients, shown to demonstrate the
            layout. Supply three to six approved case studies and they replace these
            without a layout change.
          </PlaceholderNote>
        ) : null}
      </Container>
    </Section>
  );
}
