import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/metadata";
import { methodSteps } from "@/content/method";
import { capabilities } from "@/content/capabilities";

export const metadata = pageMetadata({
  title: "Our approach",
  description:
    "Discover, Design, Develop, Distribute, Deconstruct, Deliver — the six steps behind every Løfte Studios project.",
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <PageHero
        title="Six steps, in this order, every time."
        standfirst="Not a methodology to be sold. Just the order the decisions have to be made in, written down so a client can see where a project is and what happens next."
      />

      <Section surface="paper" size="none" className="pb-(--spacing-section)">
        <Container>
          <ol className="border-rule border-t">
            {methodSteps.map((step) => (
              <li
                key={step.name}
                className="border-rule grid gap-x-10 gap-y-4 border-b py-10 md:grid-cols-12 md:py-14"
              >
                <div className="flex items-baseline gap-4 md:col-span-4 md:flex-col md:gap-3">
                  <span className="text-body-sm text-accent font-sans tabular-nums">
                    {String(step.index).padStart(2, "0")}
                  </span>
                  <h2 className="text-display-3 font-display">{step.name}</h2>
                </div>
                <div className="md:col-span-7 md:col-start-6">
                  <p className="text-body-lg text-balance">{step.summary}</p>
                  <p className="measure-wide text-body text-fg-muted mt-4">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section surface="chalk" labelledBy="engage-heading">
        <Container>
          <SectionHead
            id="engage-heading"
            heading="What that means in practice."
            standfirst="The method does not change with the size of the project. What changes is how many of the six capabilities a project draws on."
          />

          <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-body text-fg-muted">
                A single explainer might use two capabilities and run through all six
                steps in a fortnight. A market launch might use all six capabilities and
                loop through Develop and Distribute several times. The order holds either
                way — the sequence is what stops a project skipping the decision it does
                not want to make.
              </p>
              <p className="text-body text-fg-muted mt-5">
                The step teams most want to skip is Deconstruct. It is also the one that
                makes the next project better, so it is the one we insist on.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <h3 className="text-heading-1 font-display">The six capabilities</h3>
              <ul className="mt-5">
                {capabilities.map((capability) => (
                  <li
                    key={capability.slug}
                    className="border-rule flex items-baseline justify-between gap-6 border-b py-3.5"
                  >
                    <span className="text-body">{capability.name}</span>
                    <span className="text-micro text-fg-subtle text-right">
                      {capability.includes.length} disciplines
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-body-sm text-fg-muted mt-6">
                <TextLink href="/services">See how they group into services</TextLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
