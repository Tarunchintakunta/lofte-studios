import { Container, Section, SectionHead } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { cta, site } from "@/lib/site";

/**
 * Phase 1 skeleton. Exercises all three editorial fields, the display scale,
 * both button variants, and the reading measure so the foundation can be
 * reviewed at every viewport before the homepage sections are written.
 */
export default function HomePage() {
  return (
    <>
      <Section surface="ink" size="none" className="pt-40 pb-(--spacing-section) md:pt-48">
        <Container>
          <h1 className="optical-left max-w-[15ch] text-display-1">{site.tagline}</h1>
          <p className="measure-wide mt-8 text-body-lg text-fg-muted">
            Løfte Studios shapes clear, culturally fluent content across words, motion,
            sound, and visual systems.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href={cta.primary.href} size="lg">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href={cta.secondary.href} variant="outline" size="lg">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead
            heading="A complete content studio, without the usual handoffs."
            standfirst="Strategy, production, localization, and delivery sit in one room, so the intent survives all the way to the final file."
          />
          <p className="measure mt-10 text-body text-fg-muted">
            Foundation check: body copy on the paper field, at the reading measure, with
            an <TextLink href="/services">inline link</TextLink> for contrast.
          </p>
        </Container>
      </Section>

      <Section surface="blue" size="tight">
        <Container>
          <h2 className="optical-left max-w-[14ch] text-display-2">
            Have a story worth lifting?
          </h2>
          <div className="mt-8">
            <ButtonLink href={cta.primary.href} variant="outline" size="lg">
              {cta.primary.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
