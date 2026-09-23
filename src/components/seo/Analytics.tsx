import Script from "next/script";

/**
 * Analytics placeholder — disabled by default, on purpose.
 *
 * Nothing loads unless NEXT_PUBLIC_ANALYTICS_DOMAIN is set, so the site ships
 * with no third-party requests, no cookies, and nothing that would need a
 * consent banner. The tag below is Plausible's, which is cookieless; swapping
 * in a provider that sets cookies is a decision with legal consequences and
 * means revisiting /privacy and adding consent. See LAUNCH_CHECKLIST →
 * analytics.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
