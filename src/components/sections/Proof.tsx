import { Container, Section } from "@/components/layout/Section";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { clientLogos, testimonials } from "@/content/proof";

/**
 * Proof.
 *
 * No logos and no testimonials have been approved, so none are shown. The
 * empty state says so plainly rather than filling the space with invented
 * names — which is both the brief's rule and, for a studio selling clarity,
 * the more persuasive thing to say.
 *
 * Once `src/content/proof.ts` has approved entries, this renders them and the
 * note disappears on its own.
 */
export function Proof() {
  const hasProof = clientLogos.length > 0 || testimonials.length > 0;

  return (
    <Section surface="paper" size="tight" labelledBy="proof-heading">
      <Container>
        <div className="border-rule grid gap-x-12 gap-y-8 border-t pt-8 lg:grid-cols-12">
          <h2 id="proof-heading" className="text-heading-1 font-display lg:col-span-4">
            Proof, when it is ours to show.
          </h2>

          <div className="lg:col-span-7 lg:col-start-6">
            {hasProof ? (
              <>
                {testimonials.length > 0 ? (
                  <ul className="flex flex-col gap-8">
                    {testimonials.map((quote) => (
                      <li key={quote.id}>
                        <blockquote className="measure-wide text-body-lg">
                          {quote.quote}
                        </blockquote>
                        <p className="text-body-sm text-fg-subtle mt-3">
                          {quote.attribution}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {clientLogos.length > 0 ? (
                  <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                    {clientLogos.map((logo) => (
                      <li key={logo.id} className="text-body-sm text-fg-muted">
                        {logo.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <>
                <p className="measure-wide text-body text-fg-muted">
                  Client names, logos, and quotes go here once each one is approved in
                  writing. Until then this space stays empty. A studio that invents its
                  own references is not a studio you want writing yours.
                </p>
                <PlaceholderNote className="mt-6">
                  Supply approved client logos and signed-off testimonials to fill this
                  section.
                </PlaceholderNote>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
