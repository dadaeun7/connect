import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";
import { BACKEND, keycloak } from "./lib/constant";

// keycloak JWT_SECRET_KEY
const JWKS = createRemoteJWKSet(
  new URL(keycloak + "/realms/connect/protocol/openid-connect/certs"),
);

export async function middleware(request: NextRequest) {
  // HttpOnly true 설정 ✔️
  const token = request.cookies.get("accessToken")?.value;
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    if (token) {
      try {
        await jwtVerify(token, JWKS);
        return NextResponse.redirect(new URL("/", request.url));
      } catch {
        const response = NextResponse.next();
        response.cookies.set("accessToken", "", {
          domain: ".daeun-tech.site",
          path: "/",
          maxAge: 0,
        });
        return response;
      }
    }
    return NextResponse.next();
  }

  // 2. 초댓장 수락 페이지 접근 처리
  if (pathname.startsWith("/invite/accept")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);

      const projectId = searchParams.get("projectId");
      const inviteToken = searchParams.get("token");

      const cookieOptions = {
        path: "/",
        domain: ".daeun-tech.site", // 백엔드/인증 도메인과 맞춰줌 (로컬 테스트 시에는 제거하거나 환경변수 처리)
        sameSite: "lax" as const,
        httpOnly: false, // 클라이언트(React Component)에서 읽어야 한다면 false, 서버/API에서만 읽는다면 true
      };

      if (projectId) {
        response.cookies.set(
          "pending_invite_projectId",
          projectId,
          cookieOptions,
        );
      }

      if (inviteToken) {
        response.cookies.set(
          "pending_invite_token",
          inviteToken,
          cookieOptions,
        );
      }

      return response;
    }

    return NextResponse.next();
  }

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

          console.log("AccessToken 발급 주체 이메일: ", email);

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

          if (refresh.status === 401 || !refresh.ok) {
            const loginResponse = NextResponse.redirect(
              new URL("/auth/login", request.url),
            );
            loginResponse.cookies.set("accessToken", "", {
              domain: ".daeun-tech.site",
              path: "/",
              maxAge: 0,
            });
            return loginResponse;
          }

          const setCookieHeader = refresh.headers.get("set-cookie");
          const newAccessToken = parseTokenFromSetCookie(setCookieHeader);

          if (!newAccessToken) {
            throw new Error("새로운 AccessToken 파싱 실패");
          }

          const requestHeaders = new Headers(request.headers);
          requestHeaders.set("cookie", `accessToken=${newAccessToken}`);

          const response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });

          if (setCookieHeader) {
            const cookies = refresh.headers.getSetCookie();
            cookies.forEach((cookie) => {
              response.headers.append("set-cookie", cookie);
            });
          }

          console.log("토큰 세션 갱신 완료");
          return response;
        } catch (e) {
          console.error("토큰 갱신 실패, " + e);

          const loginResponse = NextResponse.redirect(
            new URL("/auth/login", request.url),
          );

          loginResponse.cookies.set("accessToken", "", {
            domain: ".daeun-tech.site",
            path: "/",
            maxAge: 0,
          });
          return loginResponse;
        }
      }
    }
  }

  if (!token && pathname.startsWith("/project")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/project/:auth*",
    "/auth/login",
    "/auth/signup",
    "/project",
    "/refresh",
    "/invite/accept",
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
