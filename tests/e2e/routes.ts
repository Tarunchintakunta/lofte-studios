/** Every route the visual and smoke suites walk. */
export const LIVE_ROUTES = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/services/motion-made-to-be-understood", name: "service-detail" },
  { path: "/work", name: "work" },
  { path: "/work?capability=video", name: "work-filtered" },
  { path: "/work/reserved-01", name: "work-detail" },
  { path: "/approach", name: "approach" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/notes", name: "notes" },
  { path: "/notes/what-a-note-looks-like", name: "note-detail" },
  { path: "/privacy", name: "privacy" },
] as const;

/** Routes whose full-page capture is worth reviewing at every viewport. */
export const SHOT_ROUTES = LIVE_ROUTES.filter((route) => !route.path.includes("?"));
