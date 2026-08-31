export const BASE = "/u";
export const BACKEND = process.env.BACKEND;
export const backend = process.env.backend;
export const keycloak = process.env.keycloak;

export const LOGIN_COMPANY = BASE + "/login";
export const LOGIN_GITHUB = BASE + "/github";
export const LOGIN_GMAIL = BASE + "/gmail";

export const REFRESH_TOKEN = "/retoken";

export const GOOGLE_REQ_URL =
  keycloak +
  "/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=" +
  backend +
  "/auth/gmail&kc_idp_hint=google";
export const GITHUB_REQ_URL =
  keycloak +
  "/realms/connect/protocol/openid-connect/auth?client_id=connect&scope=openid&response_type=code&redirect_uri=" +
  backend +
  "/auth/github&kc_idp_hint=github";

export const GITHUB_REDIRECT_URL = backend + "/api/auth/callback/github";
export const FIGMA_REDIRECT_URL = backend + "/api/auth/callback/figma";
export const NOTION_REDIRECT_URL = backend + "/api/auth/callback/notion";
export const SLACK_REDIRECT_URL = backend + "/api/auth/callback/slack";
