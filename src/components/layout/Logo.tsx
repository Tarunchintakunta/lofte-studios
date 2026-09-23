import { cn } from "@/lib/cn";

/**
 * PLACEHOLDER wordmark — original, but not the final studio logo.
 * See LAUNCH_CHECKLIST → logo-svg.
 *
 * The mark is the ø. It is already the distinctive glyph in "Løfte", so it
 * carries the signal colour rather than having a line drawn through it: an
 * earlier version extended the slash by hand and read as a strikethrough at
 * nav size. `text-accent` is field-aware — sky on ink (7.90:1), deep blue on
 * paper (6.81:1) — so the mark stays legible on both editorial fields.
 */
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  /** Drops the "Studios" word below `sm`, where the nav bar is tightest. */
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline gap-[0.22em]",
        "text-fg text-[1.0625rem] font-semibold tracking-[-0.03em]",
        className,
      )}
    >
      <span>
        L<span className="text-accent">ø</span>fte
      </span>
      <span className={cn("text-fg-subtle", compact && "hidden sm:inline")}>Studios</span>
    </span>
  );
}
