import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { Analytics } from "@/components/seo/Analytics";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/StructuredData";
import "./globals.css";

/**
 * Display face. DM Sans is explicitly sanctioned by DESIGN_BRIEF.md and is
 * OFL-licensed, so it can ship without a foundry agreement. Self-hosted and
 * subset by next/font — no request ever leaves for a font CDN.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"], // latin-ext carries the ø
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});

/** UI, body, controls, small text. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: siteUrl,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f1e8",
  colorScheme: "light",
};

/**
 * Marks the document as JS-capable before first paint. Elements a GSAP
 * timeline will reveal are only hidden while `html.js` is present, so a
 * no-JS visitor still gets every word in document order.
 */
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="surface-paper bg-surface text-fg flex min-h-dvh flex-col">
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
