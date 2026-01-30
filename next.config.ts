import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://13.53.205.86/:path*",

        // 🔴 CHANGE to your REAL backend HTTPS URL
      },
    ];
  },
};

export default nextConfig;
