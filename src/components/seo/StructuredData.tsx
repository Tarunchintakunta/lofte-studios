import type { Service } from "@/content/services";
import { site, siteUrl } from "@/lib/site";

/**
 * JSON-LD.
 *
 * Only facts that are true of this site go in. No aggregate rating, no review
 * count, no founding date, no employee count — every one of those would be
 * invented, and structured data is exactly where an invented claim does the
 * most damage.
 *
 * `email` and `address` are omitted while they are placeholders rather than
 * published as fiction.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from local constants, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const isPlaceholderEmail = site.email.endsWith("example.com");

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        alternateName: site.asciiName,
        url: siteUrl,
        description: site.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressCountry: "IN",
        },
        ...(isPlaceholderEmail ? {} : { email: site.email }),
        ...(site.social.length > 0
          ? { sameAs: site.social.map((entry) => entry.href) }
          : {}),
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      }}
    />
  );
}

export function ServiceSchema({ service }: { service: Service }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${siteUrl}/services/${service.slug}#service`,
        name: service.title,
        description: service.summary,
        url: `${siteUrl}/services/${service.slug}`,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: site.country },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: service.title,
          itemListElement: service.deliverables.map((deliverable) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: deliverable },
          })),
        },
      }}
    />
  );
}

export function BreadcrumbSchema({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          item: `${siteUrl}${entry.path}`,
        })),
      }}
    />
  );
}
