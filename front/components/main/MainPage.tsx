"use client";

import { ArrowRight, Zap, GitBranch, LayoutGrid } from "lucide-react";
import Link from "next/link";
import LoginStateToggle from "./LoginStateToggle";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GithubIcon from "../share/svg_icon/GithubIcon";
import NotionIcon from "../share/svg_icon/NotionIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import SlackIcon from "../share/svg_icon/SlackIcon";

// ─── 서비스 연결 플로우 인터랙티브 컴포넌트 ────────────────────────────────────
const SERVICE_NODES = [
  {
    id: "github",
    label: "GitHub",
    color: "var(--github-text)",
    bg: "var(--github-bg)",
    border: "var(--github-border)",
    icon: <GithubIcon />,
    eventIcon: GithubIcon,
    events: ["PR merged", "Issue closed", "Commit pushed"],
  },
  {
    id: "figma",
    label: "Figma",
    color: "var(--figma-text)",
    bg: "var(--figma-bg)",
    border: "var(--figma-border)",
    icon: <FigmaIcon />,
    eventIcon: FigmaIcon,
    events: ["Frame updated", "Comment added", "Design exported"],
  },
  {
    id: "notion",
    label: "Notion",
    color: "var(--notion-text)",
    bg: "var(--notion-bg)",
    border: "var(--notion-border)",
    icon: <NotionIcon />,
    eventIcon: NotionIcon,
    events: ["Page created", "Doc updated", "Task checked"],
  },
  {
    id: "slack",
    label: "Slack",
    color: "var(--slack-text)",
    bg: "var(--slack-bg)",
    border: "var(--slack-border)",
    icon: <SlackIcon />,
    eventIcon: SlackIcon,
    events: ["Message sent", "Channel alert", "Webhook triggered"],
  },
];

function ServiceFlowDiagram() {
  const [flowStep, setFlowStep] = useState(0);

  // 💡 컴포넌트 함수 자체를 상태에 담을 때는 React.ComponentType 타입을 사용하는 것이 가장 안전합니다.
  const [liveEvents, setLiveEvents] = useState<
    {
      id: number;
      serviceIc: React.ComponentType;
      text: string;
      color: string;
    }[]
  >([]);
  const counterRef = useRef(0);

  // 자동 플로우 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStep((s) => (s + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // 라이브 이벤트 스트림
  useEffect(() => {
    const interval = setInterval(() => {
      const svc =
        SERVICE_NODES[Math.floor(Math.random() * SERVICE_NODES.length)];
      const text = svc.events[Math.floor(Math.random() * svc.events.length)];
      const id = counterRef.current++;
      setLiveEvents((prev) => [
        { id, serviceIc: svc.eventIcon, text, color: svc.color },
        ...prev.slice(0, 4),
      ]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-5 mb-20">
      {/* 라이브 이벤트 스트림 */}
      <div className="mt-8 border border-[var(--border)] rounded-2xl bg-[var(--card)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-[var(--muted)]/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            Task
          </span>
          <span className="ml-auto text-[10px] font-mono text-[var(--muted-foreground)]/50">
            Events
          </span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {liveEvents.length === 0 ? (
            <div className="px-5 py-4 text-xs text-[var(--muted-foreground)] font-medium">
              이벤트 수신 대기 중...
            </div>
          ) : (
            liveEvents.map((ev, i) => {
              // 💡 변수명을 대문자로 선언하여 React가 확실하게 컴포넌트 타입으로 인지하도록 처리합니다.
              const EventIconComponent = ev.serviceIc;

              return (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 px-5 py-3 transition-all duration-500"
                  style={{
                    opacity: 1 - i * 0.18,
                    animation: i === 0 ? "float-up 0.35s ease both" : undefined,
                  }}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                    {EventIconComponent ? <EventIconComponent /> : null}
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]/80">
                    {ev.text}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-[var(--muted-foreground)]/40">
                    {dateFormat()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const dateFormat = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${hours}시 ${minutes}분 ${seconds}초`;
};

// ─── 피처 카드 ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Zap size={18} />,
    label: "Realtime sync",
    title: "하나의 태스크로 인덱싱",
    desc: "Webhook 연동으로 각 서비스 이벤트를 실시간 수집 후, 단일 태스크 노드로 통합합니다.",
    accent: "var(--task-amber)",
    accentBg: "var(--task-amber-bg)",
  },
  {
    icon: <GitBranch size={18} />,
    label: "Tree data model",
    title: "트리 구조 데이터 모델",
    desc: "마일스톤 → 이슈 → 커밋/코멘트로 이어지는 계층 구조로 협업 맥락을 보존합니다.",
    accent: "var(--task-violet)",
    accentBg: "var(--task-violet-bg)",
  },
  {
    icon: <LayoutGrid size={18} />,
    label: "Borderless workflow",
    title: "경계 없는 작업 흐름",
    desc: "기획자·디자이너·개발자가 각자의 툴을 유지하면서도 하나의 타임라인 안에서 소통합니다.",
    accent: "var(--task-teal)",
    accentBg: "var(--task-teal-bg)",
  },
];

const items = ["Slack 대화", "Figma 작업", "Notion 기획", "GitHub 커밋"];

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden flex-col">
      {/* Nav */}
      <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex justify-start">
          <img src="/logo.png" className="w-7 h-7 object-contain" alt="logo" />
        </div>
        <div className="flex gap-16 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
          <a
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            작업 흐름
          </a>
          <a
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            통합 목록
          </a>
          <a
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            요금제
          </a>
        </div>
        <div className="flex justify-end">
          <Suspense
            fallback={<div className="p-4 bg-gray-100 animate-pulse">...</div>}
          >
            <LoginStateToggle isLoggedIn={isLoggedIn} />
          </Suspense>
        </div>
      </nav>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-15 pb-8 px-8 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* 각 서비스 애니메이션 설명 */}
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
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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

          {/*데이터 연결하기 및 github 가기 */}
          <div className="flex gap-3 mt-8">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[var(--primary-foreground)] transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "var(--foreground)" }}
            >
              데이터 연결하기 <ArrowRight size={15} />
            </button>
            <Link href="https://github.com/dadaeun7/connect">
              <button className="px-6 py-3 rounded-xl text-sm font-bold border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                GitHub 보러가기
              </button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="px-8 py-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h3 className="text-sm font-bold mt-1.5 mb-2.5 text-[var(--foreground)] relative z-10">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium relative z-10">
                {f.desc}
              </p>
            </div>
          ))}
        </section>
        {/* 인터랙티브 플로우 다이어그램 */}
        <ServiceFlowDiagram />
      </main>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 w-full px-10 py-8 border-t border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md z-40">
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
  );
}
