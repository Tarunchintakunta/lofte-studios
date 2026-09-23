import type { Metadata } from "next";
import { site, siteUrl } from "./site";

/**
 * One place that builds page metadata, so every route gets a canonical URL and
 * matching Open Graph tags without each page remembering to.
 *
 * `metadataBase` is set in the root layout, so relative canonicals resolve
 * against NEXT_PUBLIC_SITE_URL. Until a production domain is configured that
 * is localhost — see LAUNCH_CHECKLIST → domain.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  /** Route path with a leading slash, e.g. "/services". */
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const fullTitle = `${title} — ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
