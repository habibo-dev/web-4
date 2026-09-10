import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/webp", "image/avif"],
    // Responsive breakpoints tuned for a photo-heavy catalog site.
    deviceSizes: [360, 420, 540, 640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [24, 32, 48, 64, 96, 128, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ["react-leaflet", "leaflet"],
  },
  async headers() {
    return [
      {
        source: "/fonts/:all*(.woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:all*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
