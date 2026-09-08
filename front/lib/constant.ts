export const BASE = "/u";
export const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
export const keycloak = process.env.NEXT_PUBLIC_KEYCLOAK;

export const LOGIN_COMPANY = BASE + "/login";
export const LOGIN_GITHUB = BASE + "/github";
export const LOGIN_GMAIL = BASE + "/gmail";

export const REFRESH_TOKEN = "/retoken";

export const GOOGLE_REQ_URL =
  keycloak +
  "/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=" +
  BACKEND +
  "/auth/gmail&kc_idp_hint=google";
export const GITHUB_REQ_URL =
  keycloak +
  "/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=" +
  BACKEND +
  "/auth/github&kc_idp_hint=github";

export const GITHUB_REDIRECT_URL = BACKEND + "/api/auth/callback/github";
export const FIGMA_REDIRECT_URL = BACKEND + "/api/auth/callback/figma";
export const NOTION_REDIRECT_URL = BACKEND + "/api/auth/callback/notion";
export const SLACK_REDIRECT_URL = BACKEND + "/api/auth/callback/slack";
