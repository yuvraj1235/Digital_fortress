import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.60.47.208/:path*", // CORRECT
      },
    ];
  },
};

export default nextConfig;
