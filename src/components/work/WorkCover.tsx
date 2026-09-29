import { cn } from "@/lib/cn";
import { capabilities } from "@/content/capabilities";
import type { CaseStudy } from "@/content/case-studies";

/**
 * A typographic cover for a case study that has no photograph yet: sector,
 * client, the title, what was delivered, and the disciplines involved, set on
 * the same warm dark field as the hero. Real information rather than an
 * abstract plate, and it steps aside the moment `study.cover` is supplied.
 */

const GLOWS = ["85% 20%", "15% 85%", "80% 90%", "20% 15%"];

export function WorkCover({
  study,
  seed,
  size = "standard",
  className,
}: {
  study: CaseStudy;
  seed: number;
  size?: "standard" | "wide";
  className?: string;
}) {
  const wide = size === "wide";
  const names = study.capabilities
    .map((slug) => capabilities.find((c) => c.slug === slug)?.name)
    .filter(Boolean) as string[];
  const deliverables = study.deliverables ?? [];

  return (
    <div
      className={cn(
        "bg-ink-sunken relative flex h-full w-full flex-col justify-between overflow-hidden text-white",
        wide ? "p-7 md:p-12" : "p-6 md:p-8",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(60% 70% at ${GLOWS[seed % GLOWS.length]}, color-mix(in oklab, var(--color-coral) 45%, transparent), transparent 70%)`,
      }}
    >
      {/* Loose lines settling into one, the studio's mark in miniature. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 opacity-40"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${8 + i * 10.5} C60 ${(i * 37) % 100} 90 ${50 + ((i * 23) % 40) - 20} 130 50`}
            fill="none"
            stroke="white"
            strokeOpacity={0.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1="130"
          y1="50"
          x2="200"
          y2="50"
          stroke="var(--color-coral)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        {study.status === "sample" ? (
          <span className="bg-coral text-ink rounded-full px-2.5 py-1">Sample</span>
        ) : null}
        {study.sector ? (
          <span className="rounded-full border border-white/40 px-2.5 py-1">
            {study.sector}
          </span>
        ) : null}
      </div>

      <div className="relative max-w-[34rem]">
        {study.client ? <p className="text-sm text-white/70">{study.client}</p> : null}
        <p
          className={cn(
            "font-display mt-2 font-semibold tracking-[-0.03em] text-balance",
            wide ? "text-display-3" : "text-heading-1",
          )}
        >
          {study.title}
        </p>
        {wide && deliverables.length > 0 ? (
          <ul className="mt-5 hidden gap-x-5 gap-y-1 text-sm text-white/80 md:flex md:flex-wrap">
            {deliverables.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="bg-coral size-1.5 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <ul className="flex flex-wrap gap-1.5">
          {names.map((name) => (
            <li key={name} className="rounded-full bg-white/12 px-3 py-1 text-xs">
              {name}
            </li>
          ))}
        </ul>
        {deliverables.length > 0 ? (
          <p className="text-xs text-white/70">{deliverables.length} deliverables</p>
        ) : null}
      </div>
    </div>
  );
}
