export const BASE = "/u";
export const BACKEND = "http://localhost:8080";

export const LOGIN_COMPANY = BASE + "/login";
export const LOGIN_GITHUB = BASE + "/github";
export const LOGIN_GMAIL = BASE + "/gmail";

export const REFRESH_TOKEN = "/retoken";

export const GOOGLE_REQ_URL =
  "http://localhost:8079/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=http://localhost:8080/auth/gmail&kc_idp_hint=google";
export const GITHUB_REQ_URL =
  "http://localhost:8079/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=http://localhost:8080/auth/github&kc_idp_hint=github";

export const GITHUB_REDIRECT_URL =
  "http://localhost:8080/api/auth/callback/github";
export const FIGMA_REDIRECT_URL =
  "http://localhost:8080/api/auth/callback/figma";
export const NOTION_REDIRECT_URL =
  "http://localhost:8080/api/auth/callback/notion";
export const SLACK_REDIRECT_URL =
  "http://localhost:8080/api/auth/callback/slack";
