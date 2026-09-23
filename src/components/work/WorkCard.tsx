import Link from "next/link";
import { WorkPlate } from "@/components/signal/WorkPlate";
import { cn } from "@/lib/cn";
import { capabilities } from "@/content/capabilities";
import type { CaseStudy } from "@/content/case-studies";

/**
 * One case-study card, used by the work listing, the homepage, and service
 * pages — which previously carried three near-identical copies of this markup
 * and, between them, no link to the detail pages at all.
 *
 * The media sits in a clipped frame and grows to 1.04 on hover or keyboard
 * focus; the gating lives in `.media-frame` / `.media-zoom` in globals.css so
 * it applies only on hover-capable pointers and only when motion is welcome.
 */
export function WorkCard({
  study,
  seed,
  size = "standard",
  headingLevel = 2,
  className,
}: {
  study: CaseStudy;
  seed: number;
  size?: "standard" | "wide";
  /** The listing sits under an h1; sections sit under an h2. */
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const isReserved = study.status === "reserved";
  const wide = size === "wide";

  const capabilityNames = study.capabilities
    .map((slug) => capabilities.find((c) => c.slug === slug)?.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <article className={className}>
      <Link href={`/work/${study.slug}`} className="media-frame group block">
        <div
          className={cn(
            "border-rule group-hover:border-fg-subtle w-full overflow-hidden border",
            "transition-colors duration-[--duration-base]",
            wide ? "aspect-[16/7]" : "aspect-[16/10]",
          )}
        >
          <WorkPlate
            seed={seed}
            ratio={wide ? "wide" : "standard"}
            className="media-zoom"
          />
        </div>
        <Heading
          className={cn(
            "font-display group-hover:text-accent mt-5 transition-colors",
            "duration-[--duration-base]",
            wide ? "text-display-3" : "text-heading-1",
          )}
        >
          {isReserved ? study.reservedTitle : study.title}
        </Heading>
      </Link>

      <p className="text-body-sm text-fg-muted measure mt-2">
        {isReserved ? study.reservedSummary : study.challenge}
      </p>
      {capabilityNames ? (
        <p className="text-micro text-fg-subtle mt-3">{capabilityNames}</p>
      ) : null}
    </article>
  );
}
