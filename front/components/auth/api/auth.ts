import { LOGIN_COMPANY } from "@/lib/constant";

interface AuthResponse {
  registration?: string;
  loginIn?: boolean;
  message?: string;
}

export async function authenticate(
  mode: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(LOGIN_COMPANY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    const errDetail =
      errData?.body?.detail || errData?.detail || "서버에 에러가 발생했습니다.";
    throw new Error(errDetail);
  }

  return response.json();
}
