import type { ReactNode } from "react";
import { Container, Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";

/**
 * The masthead every interior page opens with: one large centred headline,
 * a centred standfirst, and anything in `aside` (a button, a row of facts)
 * sitting centred beneath it. Top padding clears the floating nav.
 */
export function PageHero({
  kicker,
  title,
  standfirst,
  aside,
  children,
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  standfirst?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Section
      surface="chalk"
      size="none"
      className={cn("pt-36 pb-(--spacing-section-tight) md:pt-48", className)}
    >
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          {kicker ? (
            <p className="text-body text-fg-subtle mb-5 font-semibold">{kicker}</p>
          ) : null}
          <h1 className="text-display-1 font-display mx-auto max-w-[18ch] font-semibold tracking-[-0.045em] text-balance">
            {title}
          </h1>
          {standfirst ? (
            <p className="text-body-lg text-fg-muted mx-auto mt-8 max-w-2xl text-balance">
              {standfirst}
            </p>
          ) : null}
          {aside ? <div className="mt-10 flex justify-center">{aside}</div> : null}
        </div>
        {children}
      </Container>
    </Section>
  );
}
