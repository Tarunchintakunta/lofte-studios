import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "quiet";
type Size = "md" | "lg";

/**
 * The one interactive form on the site that is intentionally round: a CTA is a
 * node on the signal line. The travelling dot on the left is the whole hover
 * treatment — no lift, no shadow, no scale.
 */
const base =
  "group/btn relative inline-flex items-center gap-3 rounded-capsule font-sans " +
  "font-medium leading-none transition-colors duration-[--duration-base] " +
  "ease-[--ease-quiet] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  outline:
    "border border-rule-strong text-fg hover:border-fg hover:bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]",
  quiet: "text-fg-muted hover:text-fg",
};

const dotColors: Record<Variant, string> = {
  primary: "bg-sky",
  outline: "bg-accent",
  quiet: "bg-accent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-body-sm",
  lg: "px-6 py-4 text-body",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

function Inner({ variant, children }: { variant: Variant; children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "rounded-capsule h-[3px] w-[3px] shrink-0 transition-all",
          "duration-[--duration-base] ease-[--ease-signal]",
          "group-hover/btn:w-4 group-focus-visible/btn:w-4",
          dotColors[variant],
        )}
      />
      <span>{children}</span>
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}
