import type { NextConfig } from "next";
import { BACKEND, backend } from "./lib/constant";

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
        destination: BACKEND + "/retoken",
      },
      {
        source: "/project/list",
        destination: BACKEND + "/project/list",
      },
      {
        source: "/project/save",
        destination: BACKEND + "/project/save",
      },
      {
        source: "/api/app/list",
        destination: BACKEND + "/app/list",
      },
      {
        source: "/issue/:path*",
        destination: BACKEND + "/issue/:path*",
      },
      {
        source: "/project/invite/:path*",
        destination: BACKEND + "/invite/:path*",
      },
      {
        source: "/user/logout",
        destination: BACKEND + "/user/logout",
      },
      {
        source: "/update/info",
        destination: BACKEND + "/update/info",
      },
      {
        source: "/keyword/:path*",
        destination: BACKEND + "/new-issue/keyword/:path*",
      },
      {
        source: "/new-issue/:path*",
        destination: BACKEND + "/new-issue/:path*",
      },
      {
        source: "/get/keyword",
        destination: BACKEND + "/keyword/get",
      },
      {
        source: "/invite/:path*",
        destination: BACKEND + "/invite/:path*",
      },
      {
        source: "/app/:path*",
        destination: BACKEND + "/api/app/:path*",
      },
      {
        source: "/notion/reconnect",
        destination: BACKEND + "/api/oauth/reprepare",
      },
      {
        source: "/user/withdraw",
        destination: BACKEND + "/user/withdraw",
      },
    ];
  },
};

export default nextConfig;
