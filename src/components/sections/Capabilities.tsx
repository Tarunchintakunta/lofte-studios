import { Container, Section, SectionHead } from "@/components/layout/Section";
import { TextLink } from "@/components/ui/TextLink";
import { capabilities } from "@/content/capabilities";

/**
 * Capabilities read as an editorial index, not a grid of interchangeable
 * cards. A single hairline spine runs down the left with a node per row — the
 * same signal that resolves in the hero, now carrying six named capabilities.
 *
 * The hover treatment is CSS only: no scroll listener, no JavaScript, and it
 * degrades to a plain definition list.
 */
export function Capabilities() {
  return (
    <Section surface="ink" id="capabilities" labelledBy="capabilities-heading">
      <Container>
        <SectionHead
          id="capabilities-heading"
          heading="Six ways a story gets made clear."
          standfirst="Each one is a discipline in its own right. Most projects use three or four of them at once, which is the reason they sit in the same studio."
          aside={
            <p className="text-body-sm text-fg-muted">
              <TextLink href="/services">See how the services group</TextLink>
            </p>
          }
        />

        <dl className="mt-14 md:mt-20">
          {capabilities.map((capability) => (
            <div
              key={capability.slug}
              className="group border-rule relative border-t last:border-b"
            >
              {/* The spine node for this row. */}
              <span
                aria-hidden="true"
                className="bg-rule-strong group-hover:bg-accent absolute top-0 left-0 h-px w-8 transition-colors duration-[--duration-base]"
              />
              <div className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-12 md:py-9">
                <dt className="md:col-span-4 lg:col-span-3">
                  <span className="font-display text-display-3 group-hover:text-accent block transition-colors duration-[--duration-base]">
                    {capability.name}
                  </span>
                </dt>
                <dd className="md:col-span-8 lg:col-span-6">
                  <p className="text-body text-fg-muted text-balance">
                    {capability.outcome}
                  </p>
                </dd>
                <dd className="text-micro text-fg-subtle text-pretty md:col-span-12 lg:col-span-3">
                  {capability.includes.join(" · ")}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
