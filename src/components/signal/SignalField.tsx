"use client";

import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";
import { FIELD, VIEW, type Tone } from "./geometry";

const TONE_FILL: Record<Tone, string> = {
  mist: "var(--color-mist)",
  sky: "var(--color-sky)",
  coral: "var(--color-coral)",
  paper: "var(--color-paper)",
};

/**
 * The hero's signal field: scattered fragments of information resolving into a
 * single editorial register, once, on load.
 *
 * Decorative, so it is hidden from assistive technology — the hero carries its
 * meaning in the headline. The markup is the RESOLVED composition; GSAP
 * animates *from* the scattered offsets, which means no-JS and reduced-motion
 * visitors land on the finished state instead of an unresolved mess.
 */
export function SignalField({ className }: { className?: string }) {
  const rootRef = useRef<SVGSVGElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        // Nothing here is load-bearing; if the tab is hidden it simply resolves.
        paused: false,
      });

      timeline
        .from("[data-plane]", {
          opacity: 0,
          scaleY: 0.72,
          transformOrigin: "center",
          duration: 0.9,
          stagger: 0.1,
        })
        .from(
          "[data-fragment]",
          {
            // Each fragment carries its own scatter, generated deterministically.
            x: (_i, el: Element) => Number((el as SVGElement).dataset.sx),
            y: (_i, el: Element) => Number((el as SVGElement).dataset.sy),
            rotation: (_i, el: Element) => Number((el as SVGElement).dataset.sr),
            opacity: 0,
            transformOrigin: "center",
            duration: 1.15,
            stagger: { each: 0.016, from: "random" },
          },
          0.15,
        )
        .from(
          "[data-node]",
          {
            opacity: 0,
            scale: 0,
            transformOrigin: "center",
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.5",
        )
        // The signal travels the resolved lane once, then the field is still.
        .fromTo(
          "[data-signal]",
          { attr: { x: FIELD.signal.from - 150 }, opacity: 0 },
          {
            attr: { x: FIELD.signal.to },
            opacity: 1,
            duration: 1.05,
            ease: "power2.inOut",
          },
          "-=0.35",
        )
        .to("[data-signal]", { opacity: 0, duration: 0.45 }, "-=0.2");
    }, root);

    return () => context.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className={cn("h-full w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient id="lofte-signal-sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--color-sky)" stopOpacity="0" />
          <stop offset="55%" stopColor="var(--color-sky)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-sky)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Image planes sit behind, so information reads as sitting over media. */}
      <g>
        {FIELD.planes.map((plane) => (
          <rect
            key={plane.id}
            data-plane
            x={plane.x}
            y={plane.y}
            width={plane.w}
            height={plane.h}
            fill="var(--color-blue)"
            fillOpacity={0.16}
            stroke="var(--color-mist)"
            strokeOpacity={0.32}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      <g>
        {FIELD.fragments.map((fragment) => (
          <rect
            key={fragment.id}
            data-fragment
            data-sx={fragment.scatter.x}
            data-sy={fragment.scatter.y}
            data-sr={fragment.scatter.rotate}
            x={fragment.x}
            y={fragment.y}
            width={fragment.w}
            height={fragment.h}
            fill={TONE_FILL[fragment.tone]}
            fillOpacity={fragment.opacity}
          />
        ))}
      </g>

      <g>
        {FIELD.nodes.map((node) => (
          <circle
            key={node.id}
            data-node
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={TONE_FILL[node.tone]}
            fillOpacity={node.tone === "sky" ? 0.95 : 0.6}
          />
        ))}
      </g>

      {/* Starts off-stage and fully transparent; only GSAP ever moves it. */}
      <rect
        data-signal
        x={FIELD.signal.from - 150}
        y={FIELD.signal.y - 0.5}
        width={150}
        height={3}
        fill="url(#lofte-signal-sweep)"
        opacity={0}
      />
    </svg>
  );
}
