import { Container, Section, SectionHead } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const STAGES = ["Strategy", "Production", "Localization", "Delivery"];

const item = "relative min-h-10 pl-4 last:min-h-0 sm:min-h-0 sm:pt-3 sm:pl-0";
const list = "grid grid-cols-1 gap-y-4 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-0";

/**
 * The handoff diagram.
 *
 * Built from HTML and CSS rather than drawn, so the stage names are real text:
 * selectable, translatable, and read in order by a screen reader. The figure
 * carries a written equivalent, and the rules are hidden from the
 * accessibility tree.
 *
 * The rule flips orientation rather than wrapping. An earlier version laid the
 * four stages out two-by-two on narrow screens, which left the "one continuous
 * line" running across the first row only — the diagram argued the opposite of
 * what the copy says. Stacked, the line runs vertically and stays unbroken.
 */
function HandoffDiagram() {
  return (
    <figure>
      <div className="flex flex-col gap-10 sm:gap-12">
        {/* The usual route: four owners, three places to lose the intent. */}
        <div>
          <p className="text-micro text-fg-subtle">The usual route</p>
          <ol className={cn(list, "mt-4")}>
            {STAGES.map((stage, index) => (
              <li key={stage} className={item}>
                {/* Each stage owns its own segment, so the rule visibly
                    breaks between owners in either orientation. */}
                <span
                  aria-hidden="true"
                  className="bg-rule-strong absolute top-0 left-0 h-full w-px sm:h-px sm:w-full"
                />
                {index < STAGES.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="bg-coral-deep absolute -top-1 -right-3 left-auto hidden h-2.5 w-px sm:block"
                  />
                ) : null}
                <span className="text-body-sm block">{stage}</span>
              </li>
            ))}
          </ol>
          <p className="text-micro text-fg-subtle mt-4">
            Three handoffs. Every one of them is a chance for the argument to drift.
          </p>
        </div>

        {/* With Løfte: one rule, owned by the wrapper, spanning all four. */}
        <div>
          <p className="text-micro text-fg-subtle">With Løfte</p>
          <div className="relative mt-4">
            <span
              aria-hidden="true"
              className="bg-blue absolute top-0 left-0 h-full w-px sm:h-px sm:w-full"
            />
            <ol className={list}>
              {STAGES.map((stage) => (
                <li key={stage} className={item}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-blue absolute top-0 left-0 h-[7px] w-[7px] rounded-full",
                      "-translate-x-[3px] sm:translate-x-0 sm:-translate-y-[3px]",
                    )}
                  />
                  <span className="text-body-sm block">{stage}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-micro text-fg-subtle mt-4">
            One team, one continuous decision. The brief that starts the project is the
            one that finishes it.
          </p>
        </div>
      </div>

      <figcaption className="sr-only">
        A comparison of two routes through a content project. In the usual route,
        strategy, production, localization, and delivery are owned by four separate
        parties, with a break between each. At Løfte, the same four stages sit on one
        continuous line owned by one team.
      </figcaption>
    </figure>
  );
}

export function WhyLofte() {
  return (
    <Section surface="chalk" labelledBy="why-heading">
      <Container>
        <Reveal>
          <SectionHead
            align="center"
            id="why-heading"
            heading="A complete content studio, without the usual handoffs."
            standfirst="Most content problems are not craft problems. They are translation problems between the people who decide, the people who make, and the people who ship."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-2">
          <Reveal className="bg-paper rounded-[2rem] p-8 md:p-12">
            <h3 className="text-heading-1 font-display font-semibold">
              Four translations.
            </h3>
            <p className="text-body-lg text-fg-muted mt-4">
              A strategist writes a plan. An agency interprets it. A freelance editor
              interprets that. A localization vendor interprets the edit. By the time
              anything is published, nobody owns the result.
            </p>
            <h3 className="text-heading-1 font-display mt-10 font-semibold">One room.</h3>
            <p className="text-body-lg text-fg-muted mt-4">
              Løfte keeps strategy, production, localization, and delivery in one studio.
              Not to be faster — so the finished work still means what it was supposed to.
            </p>
          </Reveal>
          <Reveal delay={120} className="bg-paper rounded-[2rem] p-8 md:p-12">
            <HandoffDiagram />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
