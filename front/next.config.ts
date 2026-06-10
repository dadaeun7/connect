import type { NextConfig } from "next";
import { BASE, REFRESH_TOKEN } from "./app/etc/constant";

const backend = "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  // build 시 경고 있어도 빌드 성공
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/u/:path*",
        destination: backend + "/auth/:path*",
      },
      {
        source: "/u/retoken",
        destination: backend + "/retoken"
      }
    ];
  },
};

export default nextConfig;
