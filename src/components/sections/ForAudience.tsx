"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { audienceLead, audienceRoute, audiences } from "@/content/audiences";

/**
 * Who the studio is for, as a swipeable row of cards. Native horizontal
 * scroll with snap points — the page never pins or hijacks the wheel — plus
 * two arrow buttons for anyone without a trackpad. Every card links to the
 * service that usually leads that kind of work.
 *
 * While the row is on screen it advances one card every three seconds and
 * wraps at the end. It holds under the pointer or keyboard focus, stops for
 * good once the visitor steers it themselves, and never runs with reduced
 * motion.
 */
export function ForAudience() {
  const trackRef = useRef<HTMLUListElement | null>(null);

  const steered = useRef(false);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let held = false;
    const observer = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
      {
        threshold: 0.5,
      },
    );
    observer.observe(track);

    const hold = () => (held = true);
    const release = () => (held = track.matches(":hover, :focus-within"));
    const stop = () => (steered.current = true);
    track.addEventListener("pointerenter", hold);
    track.addEventListener("pointerleave", release);
    track.addEventListener("focusin", hold);
    track.addEventListener("focusout", release);
    // A swipe or a wheel nudge means the visitor is driving now.
    track.addEventListener("touchstart", stop, { passive: true });
    track.addEventListener("wheel", stop, { passive: true });

    const timer = window.setInterval(() => {
      if (visible && !held && !steered.current && !document.hidden) step(1);
    }, 3000);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      track.removeEventListener("pointerenter", hold);
      track.removeEventListener("pointerleave", release);
      track.removeEventListener("focusin", hold);
      track.removeEventListener("focusout", release);
      track.removeEventListener("touchstart", stop);
      track.removeEventListener("wheel", stop);
    };
  }, []);

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
        className="gallery mt-14 flex scroll-px-(--spacing-gutter) gap-4 overflow-x-auto px-(--spacing-gutter) pb-2 md:mt-20 xl:scroll-px-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2+var(--spacing-gutter)))] xl:px-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2+var(--spacing-gutter)))]"
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
            onClick={() => {
              steered.current = true;
              step(direction);
            }}
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
