import { expect, test, type ConsoleMessage } from "@playwright/test";
import { VIEWPORTS } from "../../playwright.config";
import { LIVE_ROUTES } from "./routes";

/**
 * The non-negotiables from MASTER_PROMPT Phase 6, checked on every route at
 * every target viewport: nothing scrolls sideways, and no page logs an error.
 */
for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} · ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of LIVE_ROUTES) {
      test(`${route.name}: no horizontal scroll, no console errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (message: ConsoleMessage) => {
          if (message.type() === "error") errors.push(message.text());
        });
        page.on("pageerror", (error) => errors.push(error.message));

        await page.goto(route.path, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            // Name the widest offender so a failure points at the culprit.
            culprits: Array.from(document.body.querySelectorAll<HTMLElement>("*"))
              .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120)),
          };
        });

        expect(
          overflow.scrollWidth,
          `Horizontal overflow. Widest offenders: ${overflow.culprits.join(" | ")}`,
        ).toBeLessThanOrEqual(overflow.clientWidth);

        expect(errors, `Console errors on ${route.path}`).toEqual([]);
      });
    }
  });
}
