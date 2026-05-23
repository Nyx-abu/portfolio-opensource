import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lenis"],
  },
  compress: true,
  poweredByHeader: false,
};

export default config;
