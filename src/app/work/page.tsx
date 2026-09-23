import Link from "next/link";
import { Container, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { WorkCard } from "@/components/work/WorkCard";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";
import { capabilities, type CapabilitySlug } from "@/content/capabilities";
import { getCaseStudies } from "@/lib/content";

export const metadata = pageMetadata({
  title: "Selected work",
  description:
    "Case studies from Løfte Studios across copy, video, visual, audio, localization, and strategy. Published only with client approval.",
  path: "/work",
});

/**
 * Filtering lives in the URL rather than in component state.
 *
 * That makes a filtered view shareable, back-button friendly, and — because
 * the filters are real links to real URLs — fully functional with JavaScript
 * disabled. There is no interactivity here that needed a client component.
 */
export default async function WorkPage(props: PageProps<"/work">) {
  const [params, caseStudies] = await Promise.all([props.searchParams, getCaseStudies()]);
  const requested = typeof params.capability === "string" ? params.capability : undefined;
  const active = capabilities.some((c) => c.slug === requested)
    ? (requested as CapabilitySlug)
    : undefined;

  const filtered = active
    ? caseStudies.filter((study) => study.capabilities.includes(active))
    : caseStudies;
  const hasPublished = filtered.some((study) => study.status === "published");

  return (
    <>
      <PageHero
        title="Selected work."
        standfirst="Each piece is published only once the client has approved the work, the credit, and any result shown alongside it."
      />

      <Section surface="paper" size="none" className="pb-(--spacing-section)">
        <Container>
          <nav
            aria-label="Filter work by capability"
            className="border-rule border-t pt-6"
          >
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/work"
                  aria-current={!active ? "true" : undefined}
                  className={cn(
                    "rounded-capsule text-body-sm block border px-4 py-2",
                    "transition-colors duration-[--duration-fast]",
                    !active
                      ? "border-blue bg-blue text-white"
                      : "border-rule-strong text-fg-muted hover:border-fg hover:text-fg",
                  )}
                >
                  All work
                </Link>
              </li>
              {capabilities.map((capability) => {
                const isActive = active === capability.slug;
                return (
                  <li key={capability.slug}>
                    <Link
                      href={`/work?capability=${capability.slug}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "rounded-capsule text-body-sm block border px-4 py-2",
                        "transition-colors duration-[--duration-fast]",
                        isActive
                          ? "border-blue bg-blue text-white"
                          : "border-rule-strong text-fg-muted hover:border-fg hover:text-fg",
                      )}
                    >
                      {capability.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p aria-live="polite" className="text-body-sm text-fg-subtle mt-6">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            {active ? ` in ${capabilities.find((c) => c.slug === active)?.name}` : ""}
          </p>

          {filtered.length === 0 ? (
            <p className="text-body text-fg-muted mt-10">
              Nothing published under this capability yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
              {filtered.map((study, index) => (
                <WorkCard key={study.slug} study={study} seed={index + 1} />
              ))}
            </div>
          )}

          {!hasPublished && filtered.length > 0 ? (
            <PlaceholderNote className="mt-10">
              These are reserved slots, not real projects. The filters, layout, and detail
              template are live — supply approved case studies and they populate without a
              code change.
            </PlaceholderNote>
          ) : null}
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
