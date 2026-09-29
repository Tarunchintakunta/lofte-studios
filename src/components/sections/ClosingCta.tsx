import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cta } from "@/lib/site";

/** The invitation: one centred line, one sentence, one button. */
export function ClosingCta() {
  return (
    <Section surface="wash" labelledBy="closing-heading">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="closing-heading"
            className="text-display-1 font-display font-semibold tracking-[-0.04em] text-balance"
          >
            Have a story worth lifting?
          </h2>
          <p className="text-body-lg text-fg-muted mx-auto mt-6 max-w-xl text-balance">
            Tell us what you are trying to get across and who needs to understand it. We
            will tell you what we would make and what we would leave alone.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={cta.primary.href} size="lg">
              {cta.primary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
