import { cn } from "@/lib/cn";

/**
 * A visible, honest marker. Anything the studio has not supplied yet says so
 * on the page rather than being filled with invented content.
 */
export function PlaceholderNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "border-coral-deep/70 flex flex-col gap-1.5 border-l-2 pl-3.5",
        // Always stacked: this note also sits in narrow sidebars, where a
        // side-by-side label squeezed the text into a two-word column.
        "text-micro text-fg-subtle measure-wide",
        className,
      )}
    >
      <span className="text-fg-muted shrink-0 font-sans font-semibold tracking-wide">
        Placeholder
      </span>
      <span>{children}</span>
    </p>
  );
}
