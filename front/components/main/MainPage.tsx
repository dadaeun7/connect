"use client";

import { ArrowRight, Zap, GitBranch, LayoutGrid } from "lucide-react";
import Link from "next/link";
import LoginStateToggle from "./LoginStateToggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceDashboard from "./ServiceDashboard";
import { AsyncBoundary } from "../share/wrappers/AsyncBoundary";
import { AsyncSuspense } from "../share/wrappers/AsyncSuspense";

// ─── 피처 카드 ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Zap size={18} />,
    label: "Realtime sync",
    title: "하나의 태스크로 인덱싱",
    desc: "Webhook 으로 각 서비스 이벤트를 실시간 수집 후, 관련 이슈에 통합 합니다.",
    accent: "var(--task-amber)",
    accentBg: "var(--task-amber-bg)",
  },
  {
    icon: <GitBranch size={18} />,
    label: "Tree data model",
    title: "트리 구조 데이터 모델",
    desc: "프로젝트 → 이슈 → 활동내역을 이슈로 그룹지어 확인합니다.",
    accent: "var(--task-violet)",
    accentBg: "var(--task-violet-bg)",
  },
  {
    icon: <LayoutGrid size={18} />,
    label: "Borderless workflow",
    title: "경계 없는 작업 흐름",
    desc: "기획자·디자이너·개발자가 하나의 타임라인으로 작업 흐름을 확인합니다.",
    accent: "var(--task-teal)",
    accentBg: "var(--task-teal-bg)",
  },
];

const items = ["Slack 대화", "Figma 작업", "Notion DB", "GitHub 커밋"];

// ─── 통합 서비스 배지 ─────────────────────────────────────────────────────────
interface MainPageProps {
  isLoggedIn: boolean;
}

export default function MainPage({ isLoggedIn }: MainPageProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2500); // 2.5초마다 전환
    return () => clearInterval(timer);
  }, []);

  return (
    <AsyncBoundary>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden flex-col animate-in fade-in duration-300">
        {/* Nav */}
        <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex justify-start">
            <img
              src="/logo.png"
              className="w-7 h-7 object-contain"
              alt="logo"
            />
          </div>
          <div className="flex gap-16 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]"></div>
          <div className="flex justify-end">
            <AsyncSuspense
              imageName="auth-loading"
              description="인증 상태 확인 중..."
            >
              <LoginStateToggle isLoggedIn={isLoggedIn} />
            </AsyncSuspense>
          </div>
        </nav>
        <main className="flex-1">
          {/* Hero */}
          <section className="relative pt-10 pb-8 px-8 flex flex-col items-center text-center max-w-5xl mx-auto">
            <ServiceDashboard activeIndex={index} />
            {/* 각 서비스 애니메이션 설명 */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex flex-wrap items-center gap-x-2">
                {/* 바뀔 단어가 들어갈 컨테이너 */}
                <span className="relative inline-flex h-[1.2em] overflow-hidden items-center min-w-[170px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      // 아래에서 위로 올라오는 회전/이동 효과
                      initial={{ opacity: 0, y: 20, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 30 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute left-0 font-extrabold origin-center-left"
                    >
                      {items[index]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              {/* 고정 텍스트 */}
              <span className="text-2xl text-slate-700 mt-3">
                하나의 작업으로 통합하고 관리해보세요.
              </span>
            </div>
            {/*데이터 연결하기 및 github 가기 */}
            <div className="flex gap-3 mt-8">
              <Link href="/project">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[var(--primary-foreground)] transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "var(--foreground)" }}
                >
                  데이터 연결하기 <ArrowRight size={15} />
                </button>
              </Link>
              <Link href="https://github.com/dadaeun7/connect">
                <button className="px-6 py-3 rounded-xl text-sm font-bold border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                  GitHub 보러가기
                </button>
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="px-8 py-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-transparent transition-all duration-300 overflow-hidden"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 0 0 1.5px ${f.accent}60, 0 8px 24px ${f.accent}14`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at 0% 0%, ${f.accent}08 0%, transparent 60%)`,
                  }}
                />
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-5 relative z-10 transition-colors duration-300"
                  style={{
                    background: f.accentBg,
                    color: f.accent,
                  }}
                >
                  {f.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] relative z-10">
                  {f.label}
                </span>
                <h3 className="text-s font-bold mt-1.5 mb-2.5 text-[var(--foreground)] relative z-10">
                  {f.title}
                </h3>
                <p className="text-s text-[var(--muted-foreground)] leading-relaxed font-medium relative z-10">
                  {f.desc}
                </p>
              </div>
            ))}
          </section>
        </main>
        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 w-full px-10 py-5 border-t border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <img
              src="/logo.png"
              className="w-6 h-6 object-contain opacity-40"
              alt="logo"
            />
            <p className="text-[11px] uppercase text-[var(--muted-foreground)]/50">
              Designed By Connect
            </p>
          </div>
        </footer>
      </div>
    </AsyncBoundary>
  );
}
