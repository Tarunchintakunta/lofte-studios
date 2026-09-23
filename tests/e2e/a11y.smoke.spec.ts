import { expect, test } from "@playwright/test";
import { LIVE_ROUTES } from "./routes";

test.describe("accessibility basics", () => {
  for (const route of LIVE_ROUTES) {
    test(`${route.name}: landmarks, heading order, image alt text`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "load" });

      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      // Headings may not skip a level.
      const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) =>
        nodes.map((n) => Number(n.tagName.slice(1))),
      );
      for (let i = 1; i < levels.length; i += 1) {
        expect(
          levels[i] - levels[i - 1],
          `Heading jumps from h${levels[i - 1]} to h${levels[i]}`,
        ).toBeLessThanOrEqual(1);
      }

      // Every image carries an alt attribute (empty is allowed, absent is not).
      const missingAlt = await page.$$eval("img", (imgs) =>
        imgs
          .filter((img) => !img.hasAttribute("alt"))
          .map((img) => img.outerHTML.slice(0, 120)),
      );
      expect(missingAlt).toEqual([]);
    });
  }
});

test("skip link is first in the tab order and moves focus to main", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.keyboard.press("Tab");
  const skip = page.locator("a[href='#main']");
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test("mobile menu opens, traps focus, closes on Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/", { waitUntil: "load" });

  // The visible label toggles Menu/Close, so the trigger is addressed by a
  // stable hook while its accessible name is allowed to change with state.
  const trigger = page.getByTestId("menu-trigger");
  await expect(trigger).toHaveAccessibleName("Menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAccessibleName("Close");

  const panel = page.getByTestId("mobile-menu");
  await expect(panel.getByRole("link", { name: "Services" })).toBeVisible();

  // Focus must land inside the panel, not stay behind it.
  await expect(panel.locator(":focus")).toHaveCount(1);

  // Background must not scroll while the panel is open.
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});
