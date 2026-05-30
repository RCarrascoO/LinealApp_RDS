import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['lsanehost.zapto.org']
  }
};

export default nextConfig;
