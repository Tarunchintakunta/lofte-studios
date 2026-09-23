"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container, Section } from "@/components/layout/Section";
import { PlaceholderNote } from "@/components/ui/PlaceholderNote";
import { WorkPlate } from "@/components/signal/WorkPlate";

/**
 * The editorial feature: one frame that grows as you read past it.
 *
 * On tablet and desktop the section pins briefly and the frame scrubs from
 * 0.86 to 1.03 — a camera pushing in on a single piece. The pin is short on
 * purpose (85% of a viewport); a long pin is a trap, not a technique.
 *
 * Four things keep it honest:
 *
 *  - Every word sits OUTSIDE the frame, and the whole section fits one
 *    viewport at every size it pins at. A stacked version put the caption
 *    below the fold on a 1280×800 laptop, which is exactly the failure the
 *    brief warns about, so the copy moves into its own column from `lg` up.
 *  - Nothing in the copy moves or changes during the scrub — only the frame.
 *  - `pinType: "transform"`. `body` carries `overflow-x: clip`, which can make
 *    the body a containing block and leave a `position: fixed` pin scrolling
 *    away. Transform pinning does not care.
 *  - Below 768px the pin is replaced by a short, non-pinned reveal, and under
 *    reduced motion or without JavaScript the frame renders at 1.
 */
export function FeatureZoom() {
  const rootRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          frameRef.current,
          { scale: 0.86 },
          {
            scale: 1.03,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "+=85%",
              pin: true,
              pinType: "transform",
              anticipatePin: 1,
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        // Short, non-pinned, and over before it can annoy anyone.
        gsap.fromTo(
          frameRef.current,
          { scale: 0.94 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 88%",
              end: "top 40%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <Section
      ref={rootRef}
      surface="chalk"
      size="none"
      id="feature"
      labelledBy="feature-heading"
      className="overflow-hidden py-(--spacing-section-tight) md:flex md:min-h-svh md:flex-col md:justify-center"
    >
      <Container>
        <div className="grid items-center gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="border-rule border-t pt-6">
              <h2 id="feature-heading" className="optical-left text-display-3">
                One story, cut for every place it lands.
              </h2>
              <p className="text-body-lg text-fg-muted mt-5 text-balance">
                The same argument has to survive a boardroom projector, a phone on mute,
                and a subtitle track in another language. We build for all three from the
                start rather than exporting three times and hoping.
              </p>
              <p className="text-body-sm text-fg-muted mt-5">
                Every version comes out of one edit, not three. Captions are written with
                the script rather than transcribed afterwards, and the localized cut is
                directed rather than dubbed.
              </p>
              <PlaceholderNote className="mt-6">
                An abstract composition from Løfte&rsquo;s own signal system — not a
                client project.
              </PlaceholderNote>
            </div>
          </div>

          {/* The frame. Clipped, so the oversized end of the scrub is contained,
              and sized inside its column so 1.03 cannot reach the gutter. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div
              ref={frameRef}
              data-feature-frame
              className="border-rule aspect-[16/10] w-full overflow-hidden border"
            >
              <WorkPlate seed={9} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
