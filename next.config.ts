import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  experimental: {
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    webpackBuildWorker: true,
  },
};

export default nextConfig;
