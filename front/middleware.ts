import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";
import { BACKEND } from "./lib/constant";

// keycloak JWT_SECRET_KEY
const JWKS = createRemoteJWKSet(
  new URL("http://localhost:8079/realms/connect/protocol/openid-connect/certs"),
);

export async function middleware(request: NextRequest) {
  // HttpOnly true 설정 ✔️
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    try {
      await jwtVerify(token, JWKS);
      return NextResponse.next();
    } catch (error: any) {
      if (error.code === "ERR_JWT_EXPIRED") {
        console.log("AccessToken 만료로 재발급중... ");

        try {
          const payload = decodeJwt(token);
          const email = payload.email as string;

          if (!email) throw new Error("Token 에 이메일 정보가 없습니다");

          const refresh = await fetch(BACKEND + "/retoken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          });

          if (refresh.status === 401) {
            const loginResponse = NextResponse.redirect(
              new URL("/auth/login", request.url),
            );
            loginResponse.cookies.delete("accessToken");
            return loginResponse;
          }

          if (!refresh.ok)
            throw new Error("토큰 재발급 실패, 관리자에게 문의하세요.");

          const setCookieHeader = refresh.headers.get("set-cookie");
          const newAccessToken = parseTokenFromSetCookie(setCookieHeader);

          const response = NextResponse.next({
            request: {
              headers: new Headers(request.headers),
            },
          });

          response.headers.set("Cookie", `accessToken=${newAccessToken}`);

          if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
          }

          console.log("토큰 세션 갱신 완료");
          return response;
        } catch (e) {
          console.error("토큰 갱신 실패, " + e);

          const loginResponse = NextResponse.redirect(
            new URL("/auth/login", request.url),
          );
          loginResponse.cookies.delete("accessToken");
          return loginResponse;
        }
      }
    }
  }

  if (!token && pathname.startsWith("/project")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/project/:auth*",
    "/auth/login",
    "/auth/signup",
    "/project",
    "/refresh",
  ],
};

export function parseTokenFromSetCookie(
  setCookieHeader: string | null,
): string | null {
  if (!setCookieHeader) return null;

  const firstPart = setCookieHeader.split(";")[0];
  const tokenValue = firstPart.split("=")[1];

  return tokenValue || null;
}
