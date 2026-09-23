"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container, Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";
import { methodSteps } from "@/content/method";

/**
 * The six-step method as a scroll narrative.
 *
 * The heading and the step rail stay with you in a sticky panel while the six
 * steps move past — that is the narrative, and it is built from CSS
 * `position: sticky` rather than a GSAP pin. ScrollTrigger only reports which
 * step is in view and scrubs the progress rail, so there is no pin-spacer to
 * fight, no scroll hijacking, and no layout thrash.
 *
 * Without JavaScript, or with reduced motion on, the rail lists all six steps
 * unhighlighted and the blocks read in order. Nothing is hidden, nothing is
 * pinned. This is the one true numbered sequence on the site.
 */
export function Method() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: ({ isActive }) => {
            if (isActive) setActive(index);
          },
        });
      });

      const rail = progressRef.current;
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: "[data-steps]",
              start: "top 58%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          },
        );
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <Section surface="ink" id="method" labelledBy="method-heading">
      <Container>
        <div ref={rootRef} className="grid gap-x-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="border-rule border-t pt-6 md:pt-8">
                <h2 id="method-heading" className="optical-left text-display-2">
                  The Løfte method.
                </h2>
                <p className="text-body text-fg-muted mt-6">
                  Six steps, in this order, on every project. The names are plain on
                  purpose — each one is a decision someone has to own.
                </p>
              </div>

              {/* A table of contents that advances as you read. Hidden on
                  narrow screens, where the blocks carry the sequence alone. */}
              <ol className="relative mt-10 hidden flex-col gap-3.5 pl-6 lg:flex">
                <span
                  aria-hidden="true"
                  className="bg-rule absolute top-2 bottom-2 left-0 w-px"
                />
                <span
                  ref={progressRef}
                  aria-hidden="true"
                  className="bg-accent absolute top-2 bottom-2 left-0 w-px origin-top scale-y-0"
                />
                {methodSteps.map((step, index) => (
                  <li
                    key={step.name}
                    aria-current={index === active ? "step" : undefined}
                    className={cn(
                      "text-heading-2 font-display flex items-baseline gap-3",
                      "transition-colors duration-[--duration-base]",
                      index === active ? "text-fg" : "text-fg-subtle",
                    )}
                  >
                    <span className="text-micro w-5 shrink-0 font-sans tabular-nums">
                      {String(step.index).padStart(2, "0")}
                    </span>
                    {step.name}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ol data-steps className="mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">
            {methodSteps.map((step) => (
              <li
                key={step.name}
                data-step
                className="border-rule border-t py-10 first:border-t-0 first:pt-0 md:py-14 lg:first:pt-2"
              >
                <div className="flex items-baseline gap-5">
                  <span className="text-body-sm text-accent w-8 shrink-0 font-sans tabular-nums">
                    {String(step.index).padStart(2, "0")}
                  </span>
                  <h3 className="text-display-3 font-display">{step.name}</h3>
                </div>
                <div className="lg:pl-13">
                  <p className="measure-wide text-body-lg mt-5 text-balance">
                    {step.summary}
                  </p>
                  <p className="measure-wide text-body text-fg-muted mt-4">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
