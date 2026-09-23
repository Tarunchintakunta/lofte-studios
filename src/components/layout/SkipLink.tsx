/**
 * First thing in the tab order. Fixed rather than absolute so it is visible
 * even when the page has already been scrolled.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable rounded-capsule bg-blue text-body-sm top-3 left-3 z-[60] px-5 py-3 font-medium text-white"
    >
      Skip to content
    </a>
  );
}
