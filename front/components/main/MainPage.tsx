"use client";

import {
  Layout,
  Zap,
  ChevronsLeftRightEllipsis,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import LoginStateToggle from "./LoginStateToggle";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] overflow-x-hidden">
      {/* 글로벌 탑 상향 네비게이션 */}
      <nav className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-5 border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-50">
      <div className="flex justify-start">
          <div className="text-xl font-black tracking-tighter uppercase cursor-pointer">
            <img src="/logo.png" className="w-8" />
          </div>
        </div>
        <div className="flex gap-20 text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] whitespace-nowrap">
            <a href="#" className="hover:text-[var(--primary)] transition-colors">작업 흐름</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">통합 목록</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">요금제</a>
        </div>
        <div className="flex justify-end">
            <LoginStateToggle />
        </div>
      </nav>

      {/* 히어로 중앙 정보 피드 */}
      <section className="relative pt-24 pb-20 px-8 flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.4] text-[var(--foreground)] uppercase">
          파편화 된 데이터
          <br />
          <span className="text-[var(--primary)]">통합된</span> 작업 흐름
        </h1>

        <p className="max-w-2xl text-base text-[var(--muted-foreground)] font-medium leading-relaxed">
          Slack의 휘발성 대화, Figma의 코멘트, Notion의 기획안을 하나의
          타임라인으로 통합합니다. <br /> 파편화된 협업의 끝으로 하나의 작업을
          완성합니다.
        </p>

        <div className="flex gap-4 pt-4">
          <button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-black px-6 py-3.5 rounded-lg text-sm uppercase tracking-wider flex items-center gap-2 shadow-sm hover:opacity-90">
            데이터 연결하기 <ArrowRight size={16} />
          </button>
          <Link href={"https://github.com/dadaeun7/connect"}>
            <button className="border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-black px-6 py-3.5 rounded-lg text-sm uppercase tracking-wider hover:bg-[var(--muted)] transition-colors">
              깃허브 보러가기
            </button>
          </Link>
        </div>
      </section>

      {/* 로고 스트림 섹션 */}
      <section className="px-10 py-10 border-y border-[var(--border)] bg-[var(--muted)]/30">
        <div className="max-w-4xl mx-auto flex justify-between items-center opacity-40 grayscale hover:grayscale-0 text-[var(--muted-foreground)] transition-all">
          <img src="/github.png" className="w-12" />
          <img src="/slack.png" className="w-12" />
          <img src="/notion.png" className="w-12" />
          <img src="/figma.png" className="h-12" />
        </div>
      </section>

      {/* 하단 3단 피처 카드 메트릭 구역 */}
      <section className="px-8 py-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: <Zap size={20} className="text-[var(--primary)]" />,
            title: "하나의 테스크로 인덱싱",
            desc: "Webhook 연동을 통해 각 서비스의 데이터를 실시간으로 인덱싱하여 하나의 테스크로 연결합니다.",
          },
          {
            icon: (
              <ChevronsLeftRightEllipsis
                size={20}
                className="text-[var(--primary)]"
              />
            ),
            title: "트리구조 데이터 모델",
            desc: "하나의 트리 구조로 시각화하여 각 서비스의 정보가 누락 없는 협업 환경을 제공합니다.",
          },
          {
            icon: <Layout size={20} className="text-[var(--primary)]" />,
            title: "경계 없는 작업",
            desc: "기획자, 디자이너, 개발자가 각자의 툴을 사용하면서도 하나의 라인 안에서 소통할 수 있습니다.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-xl shadow-xs group hover:border-[var(--primary)]/30 transition-colors"
          >
            <div className="w-10 h-10 bg-[var(--muted)] flex items-center justify-center rounded-lg mb-5 group-hover:border-[var(--primary)]/40 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-s font-bold uppercase mb-2 text-[var(--foreground)]">
              {feature.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium tracking-wider">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      <footer className="px-10 py-12 border-t border-[var(--border)] text-center bg-[var(--card)]">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]/60">
          Designed for high-performance development teams
        </p>
      </footer>
    </div>
  );
}
