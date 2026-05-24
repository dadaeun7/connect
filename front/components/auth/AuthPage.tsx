"use client";

import { useState } from "react";
import SelectOption from "./SelectOption";
import { icons } from "lucide-react";
import ExternalUp from "./ExternalUp";

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

  const LucideIcon1 = (icons as any)[firIcon];
  const LucideIcon2 = (icons as any)[secIcon];

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    await fetch(api, {
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [firstInput]: formFirInput,
        [secondInput]: formSecInput,
      }),
    })
      .then((e) => {
        if (e.status.toString() == "201") {
          globalThis.location.href = "/auth/verify";
        }
        e.json();
      })
      .then((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {/* 상단 텍스트 헤더 제어 영역 */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] uppercase">
          {comment}
        </h1>
        <div className="text-sm mt-2 font-medium">
          {mode !== "verify" && <SelectOption mode={mode} />}
        </div>
      </div>

      {/* 폼 메인 콘셉트 제어 영역 */}
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
              onChange={(e) => setformFirInput(e.target.value)}
              disabled={mode === "verify"}
            />
          </div>
        </div>

        {/* 두 번째 입력 필드 (비밀번호 등) */}
        <div className="flex flex-col space-y-2 relative group">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-0.5">
            {secondInput === "password" && mode === "verify"
              ? "Repeat Password"
              : secondInput}
          </label>
          <div className="relative">
            <LucideIcon2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]/60 group-focus-within:text-[var(--primary)] transition-colors" />
            <input
              type={secondInput}
              placeholder={
                secondInput === "code" && mode === "verify"
                  ? "비밀번호를 한 번 더 입력하세요"
                  : `${secondInput}`
              }
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
        {external && <ExternalUp />}
      </form>
    </>
  );
}
