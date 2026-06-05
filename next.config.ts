import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['lsanehost.zapto.org']
    }
  }
};

export default nextConfig;
