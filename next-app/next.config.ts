import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  experimental: {
    optimizePackageImports: [
      "@chakra-ui/react",
      "react-icons",
      "@tanstack/react-query",
      "react-hook-form",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: "@svgr/webpack",
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

// Warunkowe zastosowanie bundle analyzer
let finalConfig = withNextIntl(nextConfig);

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = bundleAnalyzer({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(finalConfig);
}

export default finalConfig;
