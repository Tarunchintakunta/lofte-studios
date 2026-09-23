import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Surface = "ink" | "paper" | "blue";

const surfaces: Record<Surface, string> = {
  ink: "surface-ink",
  paper: "surface-paper",
  blue: "surface-blue",
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
  surface = "ink",
  size = "base",
  as: Tag = "section",
  id,
  className,
  labelledBy,
}: {
  children: ReactNode;
  surface?: Surface;
  size?: keyof typeof sizes;
  as?: ElementType;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <Tag
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
      <div className="flex flex-col gap-x-16 gap-y-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 id={id} className="optical-left text-display-2 max-w-[18ch] text-balance">
          {heading}
        </h2>
        {aside ? <div className="shrink-0 lg:pb-2 lg:text-right">{aside}</div> : null}
      </div>
      {standfirst ? (
        <p className="measure-wide text-body-lg text-fg-muted mt-6">{standfirst}</p>
      ) : null}
    </div>
  );
}
