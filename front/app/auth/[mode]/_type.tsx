import {
  LOGIN_COMPANY,
  SIGN_UP_COMPANY,
  SIGN_UP_VERIFY,
} from "@/app/etc/constant";

export type AuthMode = "login" | "signup" | "verify" | "password";

export const Menu: Record<
  AuthMode,
  [string, string, string, boolean, string, string, string, string, string]
> = {
  login: [
    "어서오세요",
    "email",
    "password",
    true,
    "로그인",
    LOGIN_COMPANY,
    "Mail",
    "KeyRound",
    "/project/workline",
  ],
  signup: [
    "계정 생성",
    "name",
    "email",
    false,
    "다음",
    SIGN_UP_COMPANY,
    "SquareUserRound",
    "Mail",
    "/auth/verify",
  ],
  verify: [
    "계정 인증",
    "email",
    "code",
    false,
    "코드 인증하기",
    SIGN_UP_VERIFY,
    "Mail",
    "MailCheck",
    "/auth/password",
  ],
  password: [
    "가입 하기",
    "password",
    "password",
    false,
    "가입하기",
    LOGIN_COMPANY,
    "KeyRound",
    "KeyRound",
    "/",
  ],
} as const;
