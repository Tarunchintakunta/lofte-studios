/** Every route the visual and smoke suites walk. Extend as pages land. */
export const ROUTES = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/work", name: "work" },
  { path: "/approach", name: "approach" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/notes", name: "notes" },
] as const;

/** Routes that exist right now. Keeps the suite honest between phases. */
export const LIVE_ROUTES: readonly { path: string; name: string }[] = ROUTES.filter(
  (r) => r.path === "/",
);
