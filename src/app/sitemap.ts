import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getCaseStudies, getInsights, getServices } from "@/lib/content";

/**
 * Only real, indexable pages go in here.
 *
 * Reserved case-study slots and the Notes template sample are deliberately
 * left out: they carry `noIndex` in their metadata, and listing a page a
 * search engine has been told not to index is a contradiction worth avoiding.
 * The privacy placeholder is out for the same reason.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [services, caseStudies, allInsights] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getInsights(),
  ]);

  // `.map()` over an inline array widens `changeFrequency` to `string`, so the
  // frequency is attached per entry instead of bolted on afterwards.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/approach`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const workRoutes: MetadataRoute.Sitemap = caseStudies
    .filter((study) => study.status === "published")
    .map((study) => ({
      url: `${siteUrl}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  const insights = allInsights.filter((insight) => insight.status === "published");
  const noteRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${siteUrl}/notes/${insight.slug}`,
    lastModified: insight.date ? new Date(insight.date) : now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // The Notes index only earns a place once something is published under it.
  const notesIndex: MetadataRoute.Sitemap =
    insights.length > 0
      ? [
          {
            url: `${siteUrl}/notes`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
          },
        ]
      : [];

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...notesIndex, ...noteRoutes];
}
