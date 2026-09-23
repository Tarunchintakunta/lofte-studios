import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Until a production domain is configured, NEXT_PUBLIC_SITE_URL is localhost.
 * Publishing an allow-all robots file from a preview or staging origin invites
 * a duplicate of the whole site into the index, so anything that is not the
 * real origin is disallowed outright.
 */
const isProductionOrigin =
  siteUrl.startsWith("https://") && !siteUrl.includes("localhost");

export default function robots(): MetadataRoute.Robots {
  if (!isProductionOrigin) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Filter permutations are the same pieces in a different order.
        disallow: ["/work?*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
