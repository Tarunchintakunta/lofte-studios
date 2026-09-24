"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container, Section } from "@/components/layout/Section";
import { audienceLead, audienceRoute, audiences } from "@/content/audiences";

/**
 * One word, held still, while the rest of the sentence runs past it.
 *
 * "For" stays on the left for two viewports. On the right, the
 * audiences it belongs to travel up through a focal line at the middle of the
 * screen; whichever is on the line is the one being said. The section is the
 * studio's answer to "is this for us?", which is why it sits directly after the
 * capabilities and before any of the work.
 *
 * Three things make it smooth rather than merely animated:
 *
 *  - **Focus is an attribute, not a tween.** GSAP writes `data-focus` once per
 *    crossing and CSS owns the transition into coral. Tweening colour, opacity
 *    and scale on every item on every frame is how a reel like this ends up
 *    dropping frames on a laptop; one attribute write per item per crossing
 *    does not.
 *
 *  - **The travel is interpolated across measured centres.** Item heights are
 *    not uniform — the display clamp and the odd two-line label see to that —
 *    so the track's Y is interpolated through each item's real centre. Every
 *    audience gets an equal share of the scroll regardless of how tall it is,
 *    and the active index is then simply `round(p × (n - 1))`: exact, and no
 *    per-frame distance search.
 *
 *  - **The list is masked, not cropped.** A linear-gradient mask takes the top
 *    and bottom quarter to nothing, so items arrive and leave as light rather
 *    than being sliced by an edge.
 *
 * Every item is a real link to the service that leads that kind of work, so the
 * reel is navigation and not decoration. Below 768px and under reduced motion
 * `globals.css` drops the whole mechanism: no pin, no mask, no dimming — just
 * the word and a list, at full strength, in document order.
 */
export function ForAudienceReel() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        const items = gsap.utils.toArray<HTMLElement>("[data-audience]", track);
        if (items.length < 2) return;

        const setY = gsap.quickSetter(track, "y", "px");

        // Measured up front and again on every refresh: a resize changes the
        // display clamp, which changes every height, which changes every centre.
        // `interpolate` needs at least two values to build an interpolator from,
        // which the `items.length < 2` guard above already guarantees.
        const measure = () =>
          gsap.utils.interpolate(
            items.map((item) => item.offsetTop + item.offsetHeight / 2),
          );
        let centre = measure();

        let focused = -1;
        const focus = (index: number) => {
          if (index === focused) return;
          if (focused >= 0) items[focused].dataset.focus = "false";
          items[index].dataset.focus = "true";
          focused = index;
        };

        const reel = { p: 0 };
        const apply = () => {
          // The track hangs from the focal line, so centring item *i* means
          // pulling it up by exactly that item's distance from the track's top.
          setY(-centre(reel.p));
          focus(Math.round(reel.p * (items.length - 1)));
        };

        gsap.to(reel, {
          p: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=200%",
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            // 0.45, not 1. A long scrub sounds like "smoother" and reads as
            // lag: at a normal flick the highlight was landing a whole item
            // behind the focal line. This is enough to absorb wheel steps
            // without the list sliding along behind your finger.
            scrub: 0.45,
            invalidateOnRefresh: true,
            onRefresh: () => {
              centre = measure();
              apply();
            },
          },
        });

        return () => {
          for (const item of items) delete item.dataset.focus;
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <Section
      ref={rootRef}
      surface="ink"
      size="none"
      id="for"
      labelledBy="for-heading"
      className="reel-stage relative overflow-hidden py-(--spacing-section)"
    >
      <Container className="h-full">
        <div className="grid h-full gap-x-12 gap-y-12 md:grid-cols-12">
          {/* The held word. Vertically centred against the focal line, so "For"
              and whichever audience is in focus read as one sentence. */}
          <div className="md:col-span-5 md:flex md:flex-col md:justify-center lg:col-span-4">
            <h2 id="for-heading" className="optical-left text-display-1">
              For
              <span className="sr-only"> these teams</span>
            </h2>
            <hr className="hairline mt-8 md:mt-10" />
            <p className="text-body text-fg-muted measure mt-6">
              Løfte works best with teams who have something real to say and not enough
              time to say it well. Every line is a way into the discipline that usually
              leads that work.
            </p>
          </div>

          <div className="reel-column relative md:col-span-7 md:h-full lg:col-span-8">
            <div className="reel-viewport">
              <ul ref={trackRef} className="reel-track">
                {audiences.map((audience, index) => (
                  <li key={audience.label}>
                    <Link
                      href={audienceRoute(audience)}
                      data-audience
                      /* Focused in the markup, not only once GSAP runs: the
                         gated CSS dims every item, and server HTML can paint
                         before hydration. Without this the list would flash
                         entirely grey on a slow connection. */
                      data-focus={index === 0}
                      className="reel-item text-fg block py-[1.1em] md:py-[0.55em]"
                    >
                      <span className="text-display-3 font-display flex items-start gap-4">
                        {/* The signal node: a rule that draws itself out from
                            the margin as the item takes the line. Its offset is
                            a margin, never a transform — CSS owns the transform
                            on this element and would win the conflict. */}
                        <span
                          aria-hidden
                          className="reel-node bg-coral mt-[0.5em] h-px w-6 shrink-0 md:w-10"
                        />
                        <span className="text-balance">{audience.label}</span>
                      </span>

                      <span className="reel-lead text-micro mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-10 md:pl-14">
                        <span className="border-rule text-fg-muted rounded-capsule border px-2.5 py-1">
                          {audienceLead(audience)}
                        </span>
                        <span className="text-fg-subtle">{audience.note}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
