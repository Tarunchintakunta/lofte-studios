import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";
import { principles } from "@/content/about";
import { getTeam } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Løfte Studios is a creative-production and digital-storytelling partner in Hyderabad, blending strategic thinking with practical production.",
  path: "/about",
});

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero
        title="A studio built around one decision surviving."
        standfirst={`Løfte Studios is a creative-production and digital-storytelling partner in ${site.city}. We put strategy and production in the same room because the gap between them is where most content quietly loses its point.`}
      />

      <Section surface="paper" labelledBy="story-heading">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2
              id="story-heading"
              className="text-display-2 font-display font-semibold tracking-[-0.035em] text-balance"
            >
              Organised around a question.
            </h2>
            <p className="text-display-3 font-display text-fg-muted mt-8 font-semibold tracking-[-0.03em] text-balance">
              Most studios are organised around a craft. We are organised around a
              question: what does this need to make someone understand?
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-2">
            <Reveal className="bg-chalk rounded-[2rem] p-8 md:p-12">
              <h3 className="text-heading-1 font-display font-semibold">
                The format follows the point.
              </h3>
              <p className="text-body-lg text-fg-muted mt-4">
                Sometimes the honest answer is a two-minute film. Often it is a rewritten
                page, a clearer chart, or a script that stops apologising for its own
                argument. We would rather tell a client they do not need the expensive
                thing than sell it to them.
              </p>
            </Reveal>
            <Reveal delay={100} className="bg-chalk rounded-[2rem] p-8 md:p-12">
              <h3 className="text-heading-1 font-display font-semibold">
                One team, first call to handover.
              </h3>
              <p className="text-body-lg text-fg-muted mt-4">
                Writing, design, motion, sound, and localization held by the same people.
                No brief gets renegotiated at a handoff, because there are no handoffs.
                Read the six steps in <TextLink href="/approach">our approach</TextLink>.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section surface="chalk" labelledBy="principles-heading">
        <Container>
          <SectionHead
            id="principles-heading"
            heading="What you can hold us to."
            standfirst="Five commitments that are easy to check, because each one is something a client can point at and say we did or did not do it."
          />

          <dl className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal
                key={principle.title}
                delay={(index % 2) * 100}
                className={cn(
                  "bg-paper rounded-[2rem] p-8 md:p-10",
                  // An odd count closes on one full-width tile.
                  index === principles.length - 1 && index % 2 === 0 && "md:col-span-2",
                )}
              >
                <dt className="text-heading-1 font-display font-semibold text-balance">
                  {principle.title}
                </dt>
                <dd className="text-body-lg text-fg-muted mt-4">{principle.detail}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>

      {team.length > 0 ? (
        <Section surface="paper" size="tight" labelledBy="team-heading">
          <Container>
            <SectionHead id="team-heading" heading="The people." />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.id}>
                  <h3 className="text-heading-1 font-display">{member.name}</h3>
                  <p className="text-body-sm text-fg-subtle mt-1">{member.role}</p>
                  {member.bio ? (
                    <p className="text-body-sm text-fg-muted mt-3">{member.bio}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : (
        <Section surface="paper" size="tight">
          <Container>
            <PlaceholderNote>
              A team section is built and hidden. Supply names, roles, and portraits in{" "}
              <code className="text-fg-muted">src/content/about.ts</code> and it appears
              here — no invented colleagues in the meantime.
            </PlaceholderNote>
          </Container>
        </Section>
      )}

      <ClosingCta />
    </>
  );
}
