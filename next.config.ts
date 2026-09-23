import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Modern formats first; Next falls back automatically.
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults to [75] only. 90 is reserved for portfolio stills where
    // compression artefacts would be visible against large flat fields of ink.
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
