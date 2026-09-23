import { twMerge } from "tailwind-merge";

/**
 * Join class names and resolve Tailwind conflicts.
 *
 * The merge is not cosmetic. Tailwind resolves competing utilities by their
 * order in the generated stylesheet, not by their order in the attribute, so a
 * component whose base styles include `inline-flex` will silently beat a
 * caller's `hidden` — which is exactly how the mobile header overflowed at
 * 375px. `twMerge` makes last-one-wins hold, so components stay overridable.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return twMerge(parts.filter(Boolean).join(" "));
}
