import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SignalField } from "@/components/signal/SignalField";
import { cta } from "@/lib/site";

/**
 * The hero carries its meaning in the headline; the signal field is decorative
 * and hidden from assistive technology. The two sit in separate grid cells at
 * every breakpoint, so display type is never competing with the artwork for
 * contrast.
 */
export function Hero() {
  return (
    <Section surface="paper" size="none" className="overflow-hidden">
      <Container className="relative pt-32 pb-(--spacing-section-tight) md:pt-40 lg:min-h-[86svh] lg:pt-44">
        <div className="grid items-center gap-y-14 lg:h-full lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <h1 className="optical-left text-display-1 max-w-[13ch]">
              Stories that move brands forward.
            </h1>
            <p className="measure-wide text-body-lg text-fg-muted mt-8">
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
          </div>

          {/* Given real presence rather than tucked into a corner: it is the
              one moment on the page that has to be memorable. Height is capped
              against the viewport so the hero still resolves in one screen on
              a laptop. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="aspect-[7/10] w-full lg:aspect-auto lg:h-[min(74svh,44rem)]">
              <SignalField />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
