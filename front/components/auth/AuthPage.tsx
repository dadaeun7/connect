"use client";

import { useState } from "react";
import SelectOption from "./SelectOption";
import { icons } from "lucide-react";
import CstLoading from "../share/CstLoading";
import CstAlert from "../share/CstAlert";
import { LOGIN_COMPANY } from "@/lib/constant";
import ExternalUp from "./ExternalUp";
import { useRouter } from "next/navigation";

export default function AuthPage({
  mode,
  comment,
  firstInput,
  secondInput,
  external,
  button,
  api,
  firIcon,
  secIcon,
}: {
  readonly mode: string;
  readonly comment: string;
  readonly firstInput: string;
  readonly secondInput: string;
  readonly external: boolean;
  readonly button: string;
  readonly api: string;
  readonly firIcon: string;
  readonly secIcon: string;
}) {
  const [formFirInput, setformFirInput] = useState("");
  const [formSecInput, setformSecInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProps, setLoadingProps] = useState({
    icon: "connect",
    describe: "연결중입니다...",
  });

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "인증 시간이 만료되었습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const router = useRouter();

  const LucideIcon1 = (icons as any)[firIcon];
  const LucideIcon2 = (icons as any)[secIcon];

  const resPopHandler = (t: "success" | "error" | "info", message?: string) => {
    setAlertConfig((props) => ({
      ...props,
      type: t,
      isOpen: true,
      message: message || "관리자에게 문의해주세요.",
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      setLoadingProps((props) => ({
        ...props,
        icon: "mail",
        describe: "가입 메일 발송중입니다...",
      }));
    }

    setLoading(true);

    try {
      const result = await fetch(LOGIN_COMPANY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formFirInput,
          password: formSecInput,
        }),
      });

      if (!result.ok) {
        const errData = await result.json();
        const errDetail =
          errData?.body?.detail ||
          errData?.detail ||
          "서버에 에러가 발생했습니다.";
        throw new Error(errDetail);
      }

      const jsonBody = await result.json();

      if (jsonBody.registration) {
        resPopHandler("success", jsonBody.registration);
        return;
      }

      if (jsonBody.loginIn) {
        resPopHandler("success", "로그인 성공했습니다.");
        router.push("/");
        return;
      }

      if (jsonBody.message) {
        setAlertConfig((props) => ({
          ...props,
          type: "error",
          isOpen: true,
          message: jsonBody.message,
        }));
      }

      throw new Error(
        "올바르지 않은 접근이거나 유효하지 않은 응답 형태입니다.",
      );
    } catch (error: any) {
      console.error("Error:", error);
      resPopHandler("error", error.message);
    } finally {
      setformFirInput("");
      setformSecInput("");
      setLoading(false);
    }
  };
  return (
    <>
      <CstAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={alertConfig.onClose}
      />
      <>
        {loading ? (
          <CstLoading
            imageName={loadingProps.icon}
            description={loadingProps.describe}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] uppercase">
                {comment}
              </h1>
              <div className="text-sm mt-2 font-medium">
                <SelectOption mode={mode} />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 첫 번째 입력 필드 (이메일 등) */}
              <div className="flex flex-col space-y-2 relative group">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-0.5">
                  {firstInput}
                </label>
                <div className="relative">
                  <LucideIcon1 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60 group-focus-within:text-[var(--primary)] transition-colors" />
                  <input
                    type={firstInput}
                    placeholder={firstInput}
                    className="w-full bg-[var(--muted)] rounded-lg py-3.5 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                    value={formFirInput}
                    onChange={(e) => {
                      setformFirInput(e.target.value);
                    }}
                    disabled={mode === "verify"}
                  />
                </div>
              </div>

              {/* 두 번째 입력 필드 (비밀번호 등) */}
              <div className="flex flex-col space-y-2 relative group">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-0.5">
                  {secondInput}
                </label>
                <div className="relative">
                  <LucideIcon2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60 group-focus-within:text-[var(--primary)] transition-colors" />
                  <input
                    type={secondInput}
                    placeholder={secondInput}
                    className="w-full bg-[var(--muted)] rounded-lg py-3.5 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                    value={formSecInput}
                    onChange={(e) => setformSecInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 메인 서브밋 액션 실행 단추 */}
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-black py-5 rounded-lg text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity mt-4"
              >
                {button}
              </button>

              {/* 소셜 가입 연동 옵션 인클루드 */}
              {external && <ExternalUp setLoading={setLoading} />}
            </form>
          </>
        )}
      </>
    </>
  );
}
