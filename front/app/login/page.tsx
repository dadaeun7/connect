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

  // 자사 로그인/회원가입 처리
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "LOGIN") {
      // NextAuth 자사 로그인 (Credentials)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/"); //
      } else {
        alert("로그인 정보가 일치하지 않습니다.");
      }
    } else if (mode === "SIGNUP") {
      // 가입 로직 (실제로는 여기서 API를 호출하여 인증번호 발송)
      console.log("인증번호 발송:", email);
      setMode("VERIFY");
    } else if (mode === "VERIFY") {
      // 인증번호 확인 로직
      console.log("인증 완료 및 가입:", { email, verificationCode });
      alert("회원가입이 완료되었습니다.");
      setMode("LOGIN");
    }

    setIsLoading(false);
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-gray-200">
      <Link href="/">
        <img
          className="absolute left-8 top-10 rotate-90"
          src="/arrow.png"
          alt="back"
        />
      </Link>
      {/* 배경 장식 (image_fe2573.png 스타일 재현) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
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

      <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* 뒤로가기 버튼 (회원가입/인증 모드일 때만 표시) */}
        {mode !== "LOGIN" && (
          <button
            onClick={() => setMode("LOGIN")}
            className="absolute left-6 top-8 text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* 로고 섹션 */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border border-blue-500/50 bg-blue-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === "LOGIN"
              ? "Welcome Back"
              : mode === "SIGNUP"
                ? "Join Us"
                : "Verify Email"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {mode === "LOGIN" ? (
              <>
                Don't have an account yet?{" "}
                <button
                  onClick={() => setMode("SIGNUP")}
                  className="text-blue-400 hover:underline font-medium ml-1"
                >
                  Sign up
                </button>
              </>
            ) : mode === "SIGNUP" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("LOGIN")}
                  className="text-blue-400 hover:underline font-medium ml-1"
                >
                  Login
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
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3.5 w-5 h-5 text-blue-500" />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-sm tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            {isLoading
              ? "Processing..."
              : mode === "LOGIN"
                ? "Login"
                : mode === "SIGNUP"
                  ? "Continue"
                  : "Verify"}
          </button>
        </form>

        {mode === "LOGIN" && (
          <>
            <div className="flex items-center my-8">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="px-4 text-[10px] text-gray-600 font-bold tracking-widest">
                OR
              </span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Github 버튼 */}
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 bg-[#1e1e1e] border border-white/5 py-3 rounded-xl hover:bg-[#252525] transition-colors group"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400 group-hover:text-white transition-colors"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-sm font-medium">Github</span>
              </button>

              {/* Gmail 버튼 */}
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 bg-[#1e1e1e] border border-white/5 py-3 rounded-xl hover:bg-[#252525] transition-colors group"
              >
                <span className="font-black text-lg text-gray-500 group-hover:text-red-500 transition-colors">
                  G
                </span>
                <span className="text-sm font-medium">Gmail</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
