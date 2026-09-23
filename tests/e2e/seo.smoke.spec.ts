import { expect, test } from "@playwright/test";
import { LIVE_ROUTES } from "./routes";

test("every route has a canonical, a title, and a description", async ({ page }) => {
  for (const route of LIVE_ROUTES) {
    await page.goto(route.path, { waitUntil: "load" });

    await expect(page, `title on ${route.path}`).toHaveTitle(/Løfte Studios/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical, `canonical on ${route.path}`).toHaveCount(1);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length ?? 0, `description on ${route.path}`).toBeGreaterThan(40);

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle, `og:title on ${route.path}`).toBeTruthy();
  }
});

test("reserved and placeholder pages are excluded from indexing", async ({ page }) => {
  for (const path of ["/work/reserved-01", "/notes/what-a-note-looks-like", "/privacy"]) {
    await page.goto(path, { waitUntil: "load" });
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots, `robots on ${path}`).toContain("noindex");
  }
});

test("the sitemap lists only real pages", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();

  expect(xml).toContain("/services/motion-made-to-be-understood");
  expect(xml).toContain("/approach");

  // Nothing marked noindex may appear here.
  expect(xml).not.toContain("/work/reserved");
  expect(xml).not.toContain("/notes/what-a-note-looks-like");
  expect(xml).not.toContain("/privacy");
});

test("robots.txt refuses indexing from a non-production origin", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  const body = await response.text();

  // Tests run against localhost, which must never invite crawlers.
  expect(body).toContain("Disallow: /");
});

test("structured data is valid JSON and claims nothing invented", async ({ page }) => {
  await page.goto("/services/motion-made-to-be-understood", { waitUntil: "load" });

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(blocks.length).toBeGreaterThanOrEqual(3);

  const parsed = blocks.map((block) => JSON.parse(block));
  const types = parsed.map((entry) => entry["@type"]);
  expect(types).toContain("Organization");
  expect(types).toContain("WebSite");
  expect(types).toContain("Service");

  // Ratings, review counts and founding dates would all be fabricated.
  const serialised = JSON.stringify(parsed);
  for (const forbidden of [
    "aggregateRating",
    "reviewCount",
    "ratingValue",
    "foundingDate",
    "numberOfEmployees",
    "award",
  ]) {
    expect(serialised, `${forbidden} must not appear in structured data`).not.toContain(
      forbidden,
    );
  }

  // A placeholder address must not be published as though it were real.
  expect(serialised).not.toContain("example.com");
});

test("the social card renders", async ({ request }) => {
  const response = await request.get("/opengraph-image");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
  const body = await response.body();
  expect(body.byteLength).toBeGreaterThan(5000);
});
