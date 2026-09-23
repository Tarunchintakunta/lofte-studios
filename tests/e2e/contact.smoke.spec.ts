import { expect, test, type Page } from "@playwright/test";

/**
 * The enquiry form's contract: the server decides. `noValidate` turns off the
 * browser's own bubbles so these submissions actually reach the Server Action,
 * which is the layer that has to hold.
 */

/** Capability chips are a visually-hidden checkbox behind a styled label —
 *  so the test clicks the label, which is what a person clicks. */
async function pickService(page: Page, name: string) {
  const group = page.getByRole("group", { name: "What do you need help with?" });
  await group.getByText(name, { exact: true }).click();
  await expect(page.getByRole("checkbox", { name })).toBeChecked();
}

async function fillValid(page: Page, overrides: { email?: string } = {}) {
  await page.getByLabel("Your name").fill("Priya Raghunathan");
  await page.getByLabel("Work email").fill(overrides.email ?? "priya@example.com");
  await page.getByLabel("Company").fill("Example Industries");
  await pickService(page, "Video");
  await page.getByLabel("When do you need it?").selectOption("This quarter");
  await page
    .getByLabel("What are you trying to get across?")
    .fill("We have three hours of conference footage and no idea what to do with it.");
}

test.describe("enquiry form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" });
  });

  test("rejects an empty submission and reports it accessibly", async ({ page }) => {
    await page.getByRole("button", { name: "Send enquiry" }).click();

    const status = page.getByTestId("form-status");
    await expect(status).toBeVisible();
    await expect(status).toContainText("another look");

    // The failure is announced, not merely shown.
    await expect(status).toHaveAttribute("role", "alert");
    await expect(status).toBeFocused();

    // Invalid controls are marked for assistive technology.
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "true");

    // And nothing claims success.
    await expect(page.getByTestId("form-success")).toHaveCount(0);
  });

  test("rejects a malformed email and keeps what was typed", async ({ page }) => {
    await fillValid(page, { email: "not-an-email" });
    await page.getByRole("checkbox", { name: /Løfte Studios may hold/ }).check();
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.getByTestId("form-status")).toBeVisible();
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "true");

    // A rejected form must not throw away the rest of the answers.
    await expect(page.getByLabel("Your name")).toHaveValue("Priya Raghunathan");
    await expect(page.getByLabel("Company")).toHaveValue("Example Industries");
    await expect(page.getByRole("checkbox", { name: "Video" })).toBeChecked();
  });

  test("the consent checkbox is required", async ({ page }) => {
    await fillValid(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.getByTestId("form-status")).toBeVisible();
    await expect(page.getByText("before we can hold your details")).toBeVisible();
  });

  test("valid data passes validation but never claims a delivery that did not happen", async ({
    page,
  }) => {
    await fillValid(page);
    await pickService(page, "Localization");
    await page.getByRole("checkbox", { name: /Løfte Studios may hold/ }).check();
    await page.getByRole("button", { name: "Send enquiry" }).click();

    const status = page.getByTestId("form-status");
    await expect(status).toBeVisible();

    // Validation passed: no field is marked invalid.
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "false");
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "false");

    // These runs hit the production build with no email provider configured.
    // The one behaviour that must never happen is a success screen over a
    // message that was silently dropped — the form says so and points the
    // visitor at a direct address instead.
    await expect(page.getByTestId("form-success")).toHaveCount(0);
    await expect(status).toContainText("was not sent");
    await expect(status).toContainText("@");
  });

  test("capability chips are operable by keyboard", async ({ page }) => {
    const video = page.getByRole("checkbox", { name: "Video" });
    await video.focus();
    await expect(video).toBeFocused();
    await page.keyboard.press("Space");
    await expect(video).toBeChecked();
    await page.keyboard.press("Space");
    await expect(video).not.toBeChecked();
  });
});
