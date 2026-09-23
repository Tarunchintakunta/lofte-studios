import type { ReactNode } from "react";
import { Container, Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";

/**
 * The masthead every interior page opens with. Top padding clears the floating
 * nav; the kicker is a real breadcrumb-style label rather than a decorative
 * all-caps eyebrow, which DESIGN_BRIEF.md rules out.
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
      surface="ink"
      size="none"
      className={cn("pt-32 pb-(--spacing-section-tight) md:pt-40", className)}
    >
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-8">
            {kicker ? <p className="text-body-sm text-fg-subtle mb-5">{kicker}</p> : null}
            <h1 className="optical-left text-display-1 max-w-[16ch]">{title}</h1>
            {standfirst ? (
              <p className="measure-wide text-body-lg text-fg-muted mt-8">{standfirst}</p>
            ) : null}
          </div>
          {aside ? (
            <div className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end">
              {aside}
            </div>
          ) : null}
        </div>
        {children}
      </Container>
    </Section>
  );
}
