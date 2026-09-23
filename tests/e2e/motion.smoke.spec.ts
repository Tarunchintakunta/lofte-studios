import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

/**
 * The hero field's whole contract: the markup is the resolved composition and
 * GSAP animates *from* the scatter. If a refactor ever inverted that, a no-JS
 * or reduced-motion visitor would be left looking at an unresolved mess — so
 * both ends of the timeline are asserted here.
 */
test("signal field animates from scatter and settles on the resolved markup", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const read = () =>
    page.$$eval("[data-fragment]", (els) =>
      els.slice(0, 6).map((el) => el.getAttribute("transform") ?? ""),
    );

  await page.waitForTimeout(220);
  const early = await read();

  // Mid-flight, GSAP has written transforms onto the fragments.
  expect(
    early.some((t) => t.length > 0),
    "the hero field never animated — it rendered straight to its resolved state",
  ).toBe(true);

  await page.waitForTimeout(3500);
  const settled = await page.$$eval("[data-fragment]", (els) =>
    els.map((el) => {
      const t = el.getAttribute("transform") ?? "";
      const m = /translate\(\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/.exec(t);
      const r = /rotate\(\s*(-?[\d.]+)/.exec(t);
      return {
        dx: m ? Math.abs(Number(m[1])) : 0,
        dy: m ? Math.abs(Number(m[2])) : 0,
        rot: r ? Math.abs(Number(r[1])) : 0,
      };
    }),
  );

  // Settled means every fragment is back on its authored coordinates.
  const drift = settled.filter((s) => s.dx > 0.5 || s.dy > 0.5 || s.rot > 0.05);
  expect(drift, "fragments did not return to the resolved composition").toEqual([]);
});
