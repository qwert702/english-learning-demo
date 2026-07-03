import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],

  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },

  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
