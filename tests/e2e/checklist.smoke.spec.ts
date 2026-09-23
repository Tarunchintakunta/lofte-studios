import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { placeholders } from "../../src/lib/placeholders";

/**
 * Keeps the placeholder registry and the launch checklist honest about each
 * other. A placeholder added in code but never written into the checklist is
 * exactly the kind of thing that ships unnoticed.
 */
test("every registered placeholder appears in LAUNCH_CHECKLIST.md", () => {
  const checklist = readFileSync(join(process.cwd(), "LAUNCH_CHECKLIST.md"), "utf8");

  const missing = placeholders
    .filter((item) => !checklist.includes(item.id))
    .map((item) => `${item.id} (${item.needs})`);

  expect(
    missing,
    "placeholders registered in src/lib/placeholders.ts but absent from LAUNCH_CHECKLIST.md",
  ).toEqual([]);
});
