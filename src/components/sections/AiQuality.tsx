import { Container, Section, SectionHead } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";

const STAGES = ["Design", "Execute", "Evaluate", "Assure"];
const AREAS = ["Quality", "Safety", "Release readiness"];

/** The AI-operations offer: one statement, the four verbs, the three areas. */
export function AiQuality() {
  return (
    <Section surface="ink" labelledBy="ai-heading">
      <Container>
        <Reveal>
          <SectionHead
            id="ai-heading"
            heading="Multilingual human quality layer for AI products."
            standfirst="We design, execute, evaluate, and assure multilingual AI operations across quality, safety, and release readiness."
          />
        </Reveal>

        <Reveal delay={120}>
          <ol className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {STAGES.map((stage, index) => (
              <li
                key={stage}
                className="bg-ink-raised rounded-[1.5rem] p-6 text-center md:p-8"
              >
                <span className="text-accent text-body-sm font-semibold tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-heading-1 font-display mt-2 block font-semibold">
                  {stage}
                </span>
              </li>
            ))}
          </ol>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {AREAS.map((area) => (
              <li
                key={area}
                className="border-rule-strong rounded-capsule text-body-sm border px-4 py-2"
              >
                {area}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
