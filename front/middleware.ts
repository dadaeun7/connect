import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth; // req.auth가 있으면 로그인된 상태

  if (nextUrl.pathname.startsWith("/project") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/project/:path*"],
};
