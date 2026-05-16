"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

type AuthMode = "LOGIN" | "SIGNUP" | "VERIFY";

export default function Layout() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "LOGIN") {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        alert("로그인 정보가 일치하지 않습니다.");
      }
    } else if (mode === "SIGNUP") {
      setMode("VERIFY");
    } else if (mode === "VERIFY") {
      alert("회원가입이 완료되었습니다.");
      setMode("LOGIN");
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-gray-200 font-sans selection:bg-[#00FFA3] selection:text-black">
      {/* 상단 뒤로가기 화살표 이미지 커스텀 */}
      <Link href="/">
        <div className="absolute left-10 top-10 flex items-center gap-2 text-gray-500 hover:text-[#00FFA3] transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            메인화면으로 가기
          </span>
        </div>
      </Link>

      {/* 배경 장식: 네온 그린 글로우 추가 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FFA3]/5 blur-[120px] rounded-full" />
        <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
          <path
            d="M0,200 L200,200 L300,400 L700,400 L800,600 L1000,600"
            stroke="white"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M0,800 L300,800 L400,600 L600,600 L700,400 L1000,400"
            stroke="white"
            fill="none"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        {/* 로고 섹션: 네온 그린 테마로 변경 */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/5 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.15)]">
            <div className="text-[#00FFA3] font-black italic text-xl tracking-tighter">
              C
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            {mode === "LOGIN"
              ? "환영합니다!"
              : mode === "SIGNUP"
                ? "계정 생성"
                : "인증중"}
          </h1>
          <p className="text-xs text-gray-500 mt-3 font-medium tracking-tight">
            {mode === "LOGIN" ? (
              <>
                계정이 없으신가요?{" "}
                <button
                  onClick={() => setMode("SIGNUP")}
                  className="text-[#00FFA3] hover:underline font-bold ml-1"
                >
                  가입하기
                </button>
              </>
            ) : mode === "SIGNUP" ? (
              <>
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => setMode("LOGIN")}
                  className="text-[#00FFA3] hover:underline font-bold ml-1"
                >
                  로그인
                </button>
              </>
            ) : (
              `We sent a code to ${email}`
            )}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode !== "VERIFY" ? (
            <>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-600 group-focus-within:text-[#00FFA3] transition-colors" />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#00FFA3]/50 focus:ring-1 focus:ring-[#00FFA3]/50 transition-all placeholder:text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-600 group-focus-within:text-[#00FFA3] transition-colors" />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#00FFA3]/50 focus:ring-1 focus:ring-[#00FFA3]/50 transition-all placeholder:text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-4 w-5 h-5 text-[#00FFA3]" />
              <input
                type="text"
                placeholder="0 0 0 0 0 0"
                maxLength={6}
                className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-lg font-black tracking-[0.8em] text-[#00FFA3] focus:outline-none focus:border-[#00FFA3] transition-all text-center"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-[#00FFA3] disabled:bg-gray-800 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,255,163,0.2)] mt-4"
          >
            {isLoading
              ? "Processing..."
              : mode === "LOGIN"
                ? "Sign In"
                : mode === "SIGNUP"
                  ? "Continue"
                  : "Verify Code"}
          </button>
        </form>

        {mode === "LOGIN" && (
          <>
            <div className="flex items-center my-10">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="px-4 text-[10px] text-gray-700 font-black tracking-[0.3em]">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-3 bg-black border border-white/5 py-4 rounded-xl hover:border-white/20 transition-all group"
              >
                <GithubIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Github
                </span>
              </button>

              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-3 bg-black border border-white/5 py-4 rounded-xl hover:border-white/20 transition-all group"
              >
                <span className="font-black text-sm text-gray-600 group-hover:text-[#00FFA3] transition-colors italic">
                  G
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Gmail
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Github 아이콘 컴포넌트 (내부용)
function GithubIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
