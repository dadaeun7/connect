export type AuthMode = "login" | "signup" | "verify" | "password";

export const Menu: Record<AuthMode, [string, string, string, boolean, string]> =
  {
    login: ["어서오세요", "email", "password", true, "로그인"],
    signup: ["계정 생성", "name", "email", false, "다음"],
    verify: ["계정 인증", "email", "code", false, "코드 인증하기"],
    password: ["가입 하기", "password", "password", false, "가입하기"],
  } as const;
