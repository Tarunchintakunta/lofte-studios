import { expect, test } from "@playwright/test";
import { LIVE_ROUTES } from "./routes";

/**
 * Crawl every internal link on every page and check it resolves.
 *
 * This is the check that would have caught the case-study cards being rendered
 * as plain articles with no link to their detail pages — a gap that reads fine
 * in a screenshot and is invisible to a type checker.
 */
test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  const broken: string[] = [];

  for (const route of LIVE_ROUTES) {
    await page.goto(route.path, { waitUntil: "load" });

    const hrefs = await page.$$eval("a[href]", (anchors) =>
      anchors
        .map((a) => a.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("/") && !href.startsWith("//")),
    );

    for (const href of hrefs) {
      if (seen.has(href)) continue;
      seen.add(href);

      const response = await request.get(href, { maxRedirects: 3 });
      if (!response.ok()) {
        broken.push(`${href} → ${response.status()} (linked from ${route.path})`);
      }
    }
  }

  expect(seen.size, "no internal links were found at all").toBeGreaterThan(15);
  expect(broken, "broken internal links").toEqual([]);
});

test("every case study is reachable from the listing and the homepage", async ({
  page,
}) => {
  await page.goto("/work", { waitUntil: "load" });
  const listingLinks = await page.$$eval("a[href^='/work/']", (anchors) =>
    anchors.map((a) => a.getAttribute("href")),
  );
  expect(new Set(listingLinks).size).toBeGreaterThanOrEqual(3);

  await page.goto("/", { waitUntil: "load" });
  const homeLinks = await page.$$eval("a[href^='/work/']", (anchors) =>
    anchors.map((a) => a.getAttribute("href")),
  );
  expect(new Set(homeLinks).size).toBeGreaterThanOrEqual(3);
});

test("no link opens with an empty or placeholder href", async ({ page }) => {
  const offenders: string[] = [];

  for (const route of LIVE_ROUTES) {
    await page.goto(route.path, { waitUntil: "load" });
    const bad = await page.$$eval("a", (anchors) =>
      anchors
        .map((a) => a.getAttribute("href"))
        .filter((href) => href === null || href === "" || href === "#"),
    );
    if (bad.length > 0) offenders.push(`${route.path}: ${bad.length}`);
  }

  expect(offenders).toEqual([]);
});
