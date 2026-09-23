import type { ElementType, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

/**
 * The light fields, lightest to deepest, plus the blue-tinted invitation.
 * `ink` is retained and still correct, but the site no longer uses it.
 */
export type Surface = "chalk" | "paper" | "deep" | "wash" | "ink";

const surfaces: Record<Surface, string> = {
  chalk: "surface-chalk",
  paper: "surface-paper",
  deep: "surface-deep",
  wash: "surface-wash",
  ink: "surface-ink",
};

const sizes = {
  none: "",
  tight: "py-(--spacing-section-tight)",
  base: "py-(--spacing-section)",
} as const;

/**
 * A full-bleed editorial field. Switching `surface` re-declares the semantic
 * colour variables for everything inside, so components never need to know
 * which field they are sitting on.
 */
export function Section({
  children,
  surface = "paper",
  size = "base",
  as: Tag = "section",
  id,
  className,
  labelledBy,
  ref,
}: {
  children: ReactNode;
  surface?: Surface;
  size?: keyof typeof sizes;
  as?: ElementType;
  id?: string;
  className?: string;
  labelledBy?: string;
  /** React 19 passes `ref` as an ordinary prop — no forwardRef needed.
      ScrollTrigger needs the real section element to pin. */
  ref?: Ref<HTMLElement>;
}) {
  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        surfaces[surface],
        "bg-surface text-fg relative",
        sizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** 1440px max, gutters 20px → 56px. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cn("container-page", className)}>{children}</Tag>;
}

/**
 * Section masthead. No all-caps eyebrow: the brief rules those out. Hierarchy
 * comes from a hairline, a display heading, and an optional standfirst.
 */
export function SectionHead({
  id,
  heading,
  standfirst,
  aside,
  className,
}: {
  id?: string;
  heading: ReactNode;
  standfirst?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-rule border-t pt-6 md:pt-8", className)}>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <h2
          id={id}
          className="optical-left text-display-2 max-w-[18ch] text-balance lg:col-span-8"
        >
          {heading}
        </h2>

        {standfirst ? (
          <p className="measure-wide text-body-lg text-fg-muted mt-6 lg:col-span-8">
            {standfirst}
          </p>
        ) : null}

        {/* Last in the DOM so it reads after the standfirst when stacked;
            lifted into the first row only once there is a column for it. */}
        {aside ? (
          <div className="text-body-sm mt-6 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:mt-0 lg:text-right">
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
