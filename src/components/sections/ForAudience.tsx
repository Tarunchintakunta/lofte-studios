"use client";

import { useRef } from "react";
import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { audienceLead, audienceRoute, audiences } from "@/content/audiences";

/**
 * Who the studio is for, as a swipeable row of cards. Native horizontal
 * scroll with snap points — the page never pins or hijacks the wheel — plus
 * two arrow buttons for anyone without a trackpad. Every card links to the
 * service that usually leads that kind of work.
 */
export function ForAudience() {
  const trackRef = useRef<HTMLUListElement | null>(null);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <Section surface="ink" id="for" labelledBy="for-heading" className="overflow-hidden">
      <Container>
        <Reveal>
          <SectionHead
            align="center"
            id="for-heading"
            heading="For teams with something real to say."
            standfirst="And not enough time to say it well. Each of these is a way into the discipline that usually leads the work."
          />
        </Reveal>
      </Container>

      <ul
        ref={trackRef}
        className="gallery mt-14 flex gap-4 overflow-x-auto px-(--spacing-gutter) pb-2 md:mt-20 xl:px-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2+var(--spacing-gutter)))]"
      >
        {audiences.map((audience) => (
          <li key={audience.label} className="w-[82vw] shrink-0 sm:w-[24rem]">
            <Link
              href={audienceRoute(audience)}
              data-audience
              className="group bg-ink-raised flex h-full min-h-[22rem] flex-col rounded-[2rem] p-8 transition-colors duration-[--duration-base] hover:bg-[#222]"
            >
              <span className="border-rule text-fg-muted rounded-capsule self-start border px-3 py-1 text-xs">
                {audienceLead(audience)}
              </span>
              <span className="text-display-3 font-display mt-8 font-semibold tracking-[-0.03em] text-balance">
                {audience.label}
              </span>
              <span className="text-body text-fg-muted mt-4">{audience.note}</span>
              <span className="text-accent text-body-sm mt-auto pt-8 font-semibold">
                See how we help
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block transition-transform duration-[--duration-base] group-hover:translate-x-1"
                >
                  ›
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Container className="mt-8 flex justify-end gap-3">
        {([-1, 1] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            onClick={() => step(direction)}
            aria-label={direction === 1 ? "Next audiences" : "Previous audiences"}
            className="bg-ink-raised grid size-11 place-items-center rounded-full text-lg transition-colors hover:bg-[#2a2a2a]"
          >
            <span aria-hidden="true">{direction === 1 ? "›" : "‹"}</span>
          </button>
        ))}
      </Container>
    </Section>
  );
}
