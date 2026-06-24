import type { NextConfig } from "next";

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
        destination: backend + "/retoken",
      },
      {
        source: "/project/list",
        destination: backend + "/project/list",
      },
      {
        source: "/project/save",
        destination: backend + "/project/save",
      },
      {
        source: "/api/prepare/:path*",
        destination: backend + "/api/oauth/prepare/:path*",
      },
    ];
  },
};

export default nextConfig;
