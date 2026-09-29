import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { capabilities } from "@/content/capabilities";

/**
 * Capabilities as a bento of tiles — two, then three, then one full width — each a
 * rounded panel with a large name, the outcome, and a way into the service
 * that delivers it.
 */
export function Capabilities() {
  return (
    <Section surface="chalk" id="capabilities" labelledBy="capabilities-heading">
      <Container>
        <Reveal>
          <SectionHead
            align="center"
            id="capabilities-heading"
            heading="Six ways a story gets made clear."
            standfirst="Each one is a discipline in its own right. Most projects use three or four at once — which is why they sit in the same studio."
          />
        </Reveal>

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-6">
          {capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.slug}
              delay={(index % 3) * 90}
              className={cn(
                index < 2 && "lg:col-span-3",
                index >= 2 && index < 5 && "lg:col-span-2",
                // The sixth closes the grid as one full-width tile.
                index === 5 && "md:col-span-2 lg:col-span-6",
              )}
            >
              <Link
                href={`/services/${capability.service}`}
                className={cn(
                  "group bg-paper relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 md:p-10",
                  "transition-colors duration-[--duration-base] hover:bg-[--color-paper-deep]",
                  index < 2 ? "min-h-[24rem]" : "min-h-[20rem]",
                )}
              >
                <h3
                  className={cn(
                    "font-display font-semibold tracking-[-0.035em]",
                    index < 2 ? "text-display-2" : "text-display-3",
                  )}
                >
                  {capability.name}
                </h3>
                <p className="text-body-lg text-fg-muted mt-4 max-w-md text-balance">
                  {capability.outcome}
                </p>
                <p className="text-body-sm text-fg-subtle mt-auto pt-8">
                  {capability.includes.join(" · ")}
                </p>
                <span className="text-body-sm text-accent mt-3 font-semibold">
                  Learn more
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform duration-[--duration-base] group-hover:translate-x-1"
                  >
                    ›
                  </span>
                </span>
                {/* One large orange mark per tile, bleeding off the corner. */}
                <span
                  aria-hidden="true"
                  className="bg-coral absolute -right-10 -bottom-10 size-32 rounded-full opacity-15 transition-transform duration-700 group-hover:scale-125"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
