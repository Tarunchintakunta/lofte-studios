import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { cta } from "@/lib/site";

/**
 * The one place the blue field takes the whole width. It is the decisive
 * surface in the palette, so it is spent once, at the invitation.
 */
export function ClosingCta() {
  return (
    <Section surface="blue" labelledBy="closing-heading">
      <Container>
        <div className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-12">
          <h2 id="closing-heading" className="optical-left text-display-2 lg:col-span-7">
            Have a story worth lifting?
          </h2>
          <div className="lg:col-span-5">
            <p className="measure text-body-lg text-fg-muted">
              Tell us what you are trying to get across and who needs to understand it. We
              will tell you what we would make and what we would leave alone.
            </p>
            <div className="mt-8">
              <ButtonLink href={cta.primary.href} variant="outline" size="lg">
                {cta.primary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
