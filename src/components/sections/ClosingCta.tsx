"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { cta } from "@/lib/site";

/**
 * The same promise in the markets Løfte works across. The line flicks
 * through each language, lands back on English and holds there, then goes
 * round again: the whole studio in one move.
 */
const LINES = [
  { lang: "en", name: "English", latin: true, text: "One idea. Every language." },
  { lang: "hi", name: "Hindi", text: "एक विचार। हर भाषा।" },
  { lang: "te", name: "Telugu", text: "ఒక ఆలోచన. ప్రతి భాష." },
  { lang: "ta", name: "Tamil", text: "ஒரு யோசனை. ஒவ்வொரு மொழியும்." },
  { lang: "ar", name: "Arabic", text: "فكرة واحدة. كل لغة.", rtl: true },
  { lang: "es", name: "Spanish", latin: true, text: "Una idea. Cada idioma." },
  { lang: "ja", name: "Japanese", text: "ひとつのアイデアを、すべての言語で。" },
  { lang: "fr", name: "French", latin: true, text: "Une idée. Chaque langue." },
  { lang: "de", name: "German", latin: true, text: "Eine Idee. Jede Sprache." },
] as const;

const FLICK_MS = 550;
const HOLD_MS = 5000;

/**
 * The close: one line that cycles on its own while the section is on
 * screen. Without JavaScript or with reduced motion it simply stays on
 * English.
 */
export function ClosingCta() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let index = 0;
    const tick = () => {
      index = (index + 1) % LINES.length;
      setActive(index);
      timer = window.setTimeout(tick, index === 0 ? HOLD_MS : FLICK_MS);
    };
    // Only runs while visible; leaving the section parks it back on English.
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) timer = window.setTimeout(tick, HOLD_MS);
      else setActive((index = 0));
    });
    observer.observe(root);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <Section ref={rootRef} surface="wash" labelledBy="closing-heading">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="sr-only">One idea. Every language.</p>
          <div aria-hidden="true" className="grid">
            {LINES.map((line, i) => (
              <p
                key={i}
                lang={line.lang}
                dir={"rtl" in line ? "rtl" : undefined}
                className={cn(
                  "font-display text-display-2 font-semibold text-balance [grid-area:1/1]",
                  // Tight tracking is optical correction for Latin display type; on Indic,
                  // Arabic and Japanese scripts it pulls conjuncts and joins apart.
                  "latin" in line ? "tracking-[-0.03em]" : "tracking-normal",
                  "transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  i === active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {line.text}
              </p>
            ))}
          </div>
          <p
            aria-hidden="true"
            className="text-body-sm text-fg-subtle mt-4 font-semibold tracking-wider uppercase"
          >
            {LINES[active].name}
          </p>

          <h2
            id="closing-heading"
            className="text-display-3 font-display mt-16 font-semibold tracking-[-0.03em] text-balance"
          >
            Have a story worth lifting?
          </h2>
          <p className="text-body-lg text-fg-muted mx-auto mt-5 max-w-xl text-balance">
            Tell us what you are trying to get across and who needs to understand it. We
            will tell you what we would make and what we would leave alone.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={cta.primary.href} size="lg">
              {cta.primary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
