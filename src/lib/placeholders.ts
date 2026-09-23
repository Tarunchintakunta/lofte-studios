/**
 * Placeholder registry.
 *
 * Every invented-looking thing on this site is declared here so that nothing
 * can quietly ship as if it were a real Løfte fact. `LAUNCH_CHECKLIST.md` is
 * written from this list, and `<PlaceholderNote>` renders a visible marker.
 */

export type PlaceholderCategory =
  "asset" | "content" | "business" | "legal" | "integration";

export type PlaceholderItem = {
  id: string;
  category: PlaceholderCategory;
  /** What the owner must supply. */
  needs: string;
  /** Where it currently shows up. */
  where: string;
};

export const placeholders: PlaceholderItem[] = [
  {
    id: "logo-svg",
    category: "asset",
    needs: "Final Løfte wordmark/monogram as SVG (light + dark variants)",
    where: "Header, footer, favicon, OG image",
  },
  {
    id: "contact-email",
    category: "business",
    needs: "Approved studio inbox to receive enquiries",
    where: "src/lib/site.ts → site.email, contact form delivery",
  },
  {
    id: "contact-phone-address",
    category: "business",
    needs: "Phone number and postal address, if they should be published",
    where: "src/lib/site.ts → site.phone / site.address (hidden while empty)",
  },
  {
    id: "legal-name",
    category: "legal",
    needs: "Registered legal business name for the footer and Organization schema",
    where: "src/lib/site.ts → site.legalName",
  },
  {
    id: "case-studies",
    category: "content",
    needs: "3–6 real case studies with written client permission",
    where: "src/content/case-studies.ts, /work, homepage Selected work",
  },
  {
    id: "case-study-media",
    category: "asset",
    needs: "Cover stills and motion loops for each case study",
    where: "Case study cards and detail pages (generated placeholder plates today)",
  },
  {
    id: "client-logos",
    category: "content",
    needs: "Client logos with permission to display",
    where: "Homepage proof section (renders an empty, labelled state today)",
  },
  {
    id: "testimonials",
    category: "content",
    needs: "Signed-off testimonials with attribution",
    where: "Homepage proof section (renders an empty, labelled state today)",
  },
  {
    id: "team",
    category: "content",
    needs: "Team names, roles and portraits, if the About page should show them",
    where: "/about (team block hidden while the list is empty)",
  },
  {
    id: "insights",
    category: "content",
    needs: "Real articles before Notes is promoted into the primary navigation",
    where: "/notes",
  },
  {
    id: "privacy-policy",
    category: "legal",
    needs: "Privacy policy reviewed by a lawyer; this site does not provide one",
    where: "/privacy",
  },
  {
    id: "email-delivery",
    category: "integration",
    needs: "RESEND_API_KEY + verified sender + approved recipient",
    where: "Contact form (logs to the server console until configured)",
  },
  {
    id: "analytics",
    category: "integration",
    needs: "Decision on an analytics provider and a cookie/consent position",
    where: "NEXT_PUBLIC_ANALYTICS_DOMAIN (no script loads while unset)",
  },
  {
    id: "sanity",
    category: "integration",
    needs: "Sanity project id, dataset and read token",
    where: "sanity/ schemas exist; site reads local seed content until configured",
  },
  {
    id: "domain",
    category: "integration",
    needs: "Production domain + NEXT_PUBLIC_SITE_URL for canonicals and sitemap",
    where: "Metadata, sitemap.xml, robots.txt, OG image URLs",
  },
];

export const placeholdersByCategory = (category: PlaceholderCategory) =>
  placeholders.filter((p) => p.category === category);
