"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container, Section } from "@/components/layout/Section";

const TEXT =
  "Most content loses its point somewhere between the brief and the screen. We keep strategy, production, and localization in one room, so the idea you started with is the one people actually see.";

/**
 * One sentence that lights up word by word as it scrolls through the middle
 * of the screen. Without JavaScript or with reduced motion it is simply a
 * sentence at full strength.
 */
export function Statement() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              end: "bottom 45%",
              scrub: 0.3,
            },
          },
        );
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <Section ref={rootRef} surface="chalk" aria-label="What Løfte does">
      <Container>
        <p className="text-display-3 font-display mx-auto max-w-5xl text-center font-semibold tracking-[-0.03em] text-balance">
          {TEXT.split(" ").map((word, i) => (
            <span key={i} data-word>
              {word}{" "}
            </span>
          ))}
        </p>
      </Container>
    </Section>
  );
}
