import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow fetching from the external evaluation API
  async rewrites() {
    return [];
  },
};

export default nextConfig;
