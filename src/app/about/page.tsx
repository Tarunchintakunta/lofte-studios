import { Container, Section, SectionHead } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { TextLink } from "@/components/ui/TextLink";
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
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <h2 id="story-heading" className="text-display-3 font-display lg:col-span-4">
              How we work
            </h2>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-body-lg text-balance">
                Most studios are organised around a craft. We are organised around a
                question: what does this need to make someone understand?
              </p>
              <p className="text-body text-fg-muted mt-6">
                That question decides the format rather than the other way round.
                Sometimes the honest answer is a two-minute film. Often it is a rewritten
                page, a clearer chart, or a script that stops apologising for its own
                argument. We would rather tell a client they do not need the expensive
                thing than sell it to them.
              </p>
              <p className="text-body text-fg-muted mt-5">
                Practically, that means one team holding a project from the first
                conversation to the final handover — writing, design, motion, sound, and
                localization included. No brief gets renegotiated at a handoff, because
                there are no handoffs.
              </p>
              <p className="text-body text-fg-muted mt-5">
                Read the six steps that shape every project in{" "}
                <TextLink href="/approach">our approach</TextLink>.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="ink" labelledBy="principles-heading">
        <Container>
          <SectionHead
            id="principles-heading"
            heading="What you can hold us to."
            standfirst="Five commitments that are easy to check, because each one is something a client can point at and say we did or did not do it."
          />

          <dl className="mt-14 md:mt-20">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="border-rule grid gap-x-10 gap-y-3 border-t py-8 last:border-b md:grid-cols-12 md:py-10"
              >
                <dt className="md:col-span-5">
                  <span className="font-display text-heading-1 block text-balance">
                    {principle.title}
                  </span>
                </dt>
                <dd className="text-body text-fg-muted md:col-span-6 md:col-start-7">
                  {principle.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {team.length > 0 ? (
        <Section surface="ink" size="tight" labelledBy="team-heading">
          <Container>
            <SectionHead id="team-heading" heading="The people." />
            <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
        <Section surface="ink" size="tight">
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
