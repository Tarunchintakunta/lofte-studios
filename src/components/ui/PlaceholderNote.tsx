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
        "border-coral-deep/70 flex items-start gap-2.5 border-l-2 pl-3",
        "text-micro text-fg-subtle",
        className,
      )}
    >
      <span className="text-fg-muted font-sans font-semibold tracking-wide">
        Placeholder
      </span>
      <span>{children}</span>
    </p>
  );
}
