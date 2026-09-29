import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/ui/Reveal";
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

      <Section surface="chalk" size="none" className="pb-(--spacing-section)">
        <Container>
          <ol className="grid gap-4 md:grid-cols-2">
            {methodSteps.map((step, index) => (
              <Reveal
                as="li"
                key={step.name}
                delay={(index % 2) * 100}
                className="bg-paper flex min-h-[20rem] flex-col rounded-[2rem] p-8 md:p-10"
              >
                <span className="text-display-2 font-display text-accent font-semibold tabular-nums">
                  {String(step.index).padStart(2, "0")}
                </span>
                <h2 className="text-display-3 font-display mt-6 font-semibold tracking-[-0.03em]">
                  {step.name}
                </h2>
                <p className="text-body-lg mt-4 text-balance">{step.summary}</p>
                <p className="text-body text-fg-muted mt-3">{step.detail}</p>
              </Reveal>
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
