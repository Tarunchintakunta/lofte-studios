/**
 * Dates are formatted with an explicit locale and time zone so the server and
 * the client agree. Left to the environment, a build machine in one zone and a
 * reader in another can render different days for the same ISO string.
 */
const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return formatter.format(date);
}
