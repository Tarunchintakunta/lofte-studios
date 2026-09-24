"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { cta, primaryNav } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Floating navigation.
 *
 * The desktop hover treatment is a single shared hairline that slides between
 * items — the same "one clear line" idea as the hero, rather than a pill
 * background behind each link. The line rests under the current section, so
 * the indicator does double duty as the active state.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [compact, setCompact] = useState(false);

  const menuId = useId();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  /* --- Lift the bar once the page has scrolled past the top ------------- */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLifted(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /* --- Tighten the bar going down, give it back coming up ---------------
     Direction, not depth. Reading downward is when the bar is most in the way,
     and turning back up is almost always someone looking for navigation — so
     it is never more than one upward flick from full size.

     Three guards keep it from twitching: nothing happens in the first 140px,
     so the top of a page is stable; a 10px threshold absorbs trackpad jitter
     and rubber-banding; and the deltas accumulate, so a slow scroll still
     crosses the threshold rather than being ignored forever.

     Under reduced motion it does not engage at all. A size change *is* motion,
     and an instant one on every direction change would be worse than none. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ENGAGE_AFTER = 140;
    const THRESHOLD = 10;

    let lastY = window.scrollY;
    let queued = false;

    const read = () => {
      queued = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < THRESHOLD) return;
      lastY = y;
      // Same value is a no-op in React, so this does not re-render on scroll.
      setCompact(delta > 0 && y > ENGAGE_AFTER);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    const sync = () => {
      window.removeEventListener("scroll", onScroll);
      if (query.matches) {
        setCompact(false);
        return;
      }
      lastY = window.scrollY;
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* --- Close the mobile panel whenever the route changes ----------------
     Adjusted during render rather than in an effect: React re-renders before
     painting, so the panel never flashes open on the new route. */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (open) setOpen(false);
  }

  /* --- Rest the desktop indicator under the current section ------------- */
  const restIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>("[data-current='true']");
    if (!active) {
      setIndicator(null);
      return;
    }
    setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
  }, []);

  useEffect(() => {
    restIndicator();
    window.addEventListener("resize", restIndicator);
    return () => window.removeEventListener("resize", restIndicator);
  }, [restIndicator, pathname]);

  const moveIndicator = (el: HTMLElement | null) => {
    if (!el) return;
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
  };

  /* --- Scroll lock + focus management for the mobile panel -------------- */
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  /* The open panel always gets the bar at full size — a compact bar above a
     full-screen menu reads as the menu having opened by accident. */
  const tight = compact && !open;

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-page">
          <div
            data-compact={tight}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-4",
              "rounded-capsule border pr-2",
              // The whole treatment is the bar's own box: nothing inside is
              // scaled, so the type stays crisply rasterised at every size.
              "transition-[margin,padding,background-color,border-color,backdrop-filter]",
              "duration-[--duration-base] ease-[--ease-quiet]",
              "motion-reduce:transition-none",
              tight
                ? "mt-2 py-1 pl-4 md:mt-2 md:pl-5"
                : "mt-3 py-2 pl-4 md:mt-4 md:pl-6",
              lifted || open
                ? "border-rule bg-[color-mix(in_oklab,var(--color-chalk)_80%,transparent)] backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          >
            <Link
              href="/"
              className="shrink-0 rounded-sm py-1"
              aria-label="Løfte Studios — home"
            >
              <Logo compact />
            </Link>

            {/* --- Desktop navigation --- */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul
                ref={listRef}
                onMouseLeave={restIndicator}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) restIndicator();
                }}
                className="relative flex items-center gap-1"
              >
                {primaryNav.map((item) => {
                  const current = isCurrent(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        data-current={current}
                        aria-current={current ? "page" : undefined}
                        onMouseEnter={(e) => moveIndicator(e.currentTarget.parentElement)}
                        onFocus={(e) => moveIndicator(e.currentTarget.parentElement)}
                        className={cn(
                          "text-body-sm block rounded-sm px-3.5 transition-all",
                          "duration-[--duration-base] ease-[--ease-quiet]",
                          "motion-reduce:transition-none",
                          tight ? "py-1.5" : "py-2",
                          current ? "text-fg" : "text-fg-muted hover:text-fg",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

                {/* The single shared line. */}
                <li
                  aria-hidden="true"
                  className={cn(
                    "bg-accent absolute -bottom-0.5 left-0 h-px",
                    "transition-[transform,width,opacity] duration-[--duration-base]",
                    "ease-[--ease-signal] motion-reduce:transition-none",
                    indicator ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    width: indicator?.w ?? 0,
                    transform: `translateX(${indicator?.x ?? 0}px)`,
                  }}
                />
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <ButtonLink
                href={cta.primary.href}
                className={cn(
                  "px-4 transition-all duration-[--duration-base] sm:px-5",
                  "motion-reduce:transition-none",
                  tight && "py-2.5",
                )}
              >
                {cta.primary.label}
              </ButtonLink>

              <button
                ref={triggerRef}
                type="button"
                data-testid="menu-trigger"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                  "rounded-capsule border-rule-strong text-body-sm border px-4",
                  "text-fg transition-all duration-[--duration-base] lg:hidden",
                  "motion-reduce:transition-none hover:border-fg",
                  tight ? "py-2.5" : "py-3",
                )}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile / tablet panel --- */}
      <div
        id={menuId}
        ref={panelRef}
        data-testid="mobile-menu"
        hidden={!open}
        className={cn(
          "surface-paper bg-surface fixed inset-0 z-40 overflow-y-auto lg:hidden",
          "pt-24 pb-(--spacing-gutter)",
        )}
      >
        <nav aria-label="Primary" className="container-page">
          <ul className="flex flex-col">
            {primaryNav.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="border-rule border-t">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <span
                      className={cn(
                        "font-display text-display-3",
                        current ? "text-accent" : "text-fg",
                      )}
                    >
                      {item.label}
                    </span>
                    {item.hint ? (
                      <span className="text-micro text-fg-subtle max-w-[9rem] text-right">
                        {item.hint}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-rule mt-10 border-t pt-8">
            <ButtonLink href={cta.primary.href} size="lg">
              {cta.primary.label}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  );
}
