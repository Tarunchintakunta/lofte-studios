import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Inline link. The underline is drawn rather than toggled — it starts at the
 * left edge and completes on hover, echoing the signal that resolves in the
 * hero. Uses the field-aware `--accent`, which is sky on ink and deep blue on
 * paper so the contrast ratio holds on both.
 */
export function TextLink({
  href,
  children,
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">) {
  const classes = cn(
    "group/link relative inline text-accent no-underline",
    "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat",
    "bg-[length:0%_1px] bg-[position:0_100%]",
    "transition-[background-size] duration-[--duration-base] ease-[--ease-signal]",
    "hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]",
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
