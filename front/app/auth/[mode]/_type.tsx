export type AuthMode = "login" | "signup" | "verify";

export const Menu: Record<AuthMode, [string, string, string, boolean, string]> =
  {
    login: ["어서오세요", "email", "password", true, "로그인"],
    signup: ["계정 생성", "email", "password", false, "다음"],
    verify: ["계정 인증", "email", "code", false, "코드 인증하기"],
  } as const;
