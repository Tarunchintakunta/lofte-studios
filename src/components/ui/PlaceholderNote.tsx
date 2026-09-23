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
        "text-micro text-fg-subtle measure-wide sm:flex-row sm:gap-3",
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
