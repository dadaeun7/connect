"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. 첨부해주신 이미지의 각 요소들과 매칭되는 모크 데이터 정의
interface HistoryItem {
  id: string;
  source: "Notion" | "Figma" | "GitHub" | "Slack";
  title: string;
  description: string;
  time: string;
  user: string;
  avatarColor: string;
  brandColor: string;
  tags?: string[];
  extraContent?: React.ReactNode;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    source: "Notion",
    title: "기획서 업데이트",
    description: "2026 서비스 고도화 메인 페이지 요구사항 정의서.docx",
    time: "10분 전",
    user: "박다은",
    avatarColor: "bg-amber-400", // Instagram post - 1.png의 노란색 박스 반영
    brandColor: "#E2B13C",
    tags: ["기획", "문서", "Next.js"],
  },
  {
    id: "2",
    source: "Figma",
    title: "메인 UI 디자인 컴포넌트 추가",
    description: "Connect 프로젝트 메인 랜딩 페이지 대시보드 v1.2",
    time: "32분 전",
    user: "이민우",
    avatarColor: "bg-sky-400", // Instagram post - 1.png의 파란색 박스 반영
    brandColor: "#0ACF83",
    extraContent: (
      // Instagram post - 1.png 하단의 preview 컴포넌트 영역 시각화
      <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
        <div className="h-12 bg-gray-100 rounded w-full border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
          Figma Frame Preview
        </div>
      </div>
    ),
  },
  {
    id: "3",
    source: "GitHub",
    title: "main 브랜치 Pull Request 머지",
    description: "feat: Kafka 및 타임라인 API 연동 및 DB 아키텍처 최적화 (#12)",
    time: "1시간 전",
    user: "박다은",
    avatarColor: "bg-gray-700",
    brandColor: "#24292F",
  },
  {
    id: "4",
    source: "Slack",
    title: "#development 채널 알림",
    description:
      "운영 서버 모니터링 시스템 구축 완료 및 연동 테스트 정상 종료되었습니다.",
    time: "2시간 전",
    user: "김태영",
    avatarColor: "bg-indigo-500",
    brandColor: "#4A154B",
    extraContent: (
      // Instagram post - 3.png 하단의 멘션 및 전송창 레이아웃 반영
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span>@development</span>
          <span className="text-gray-300">|</span>
          <span>Thread 답변 3개</span>
        </div>
        <button className="px-3 py-1 bg-sky-500 text-white rounded text-[11px] font-medium hover:bg-sky-600 transition">
          슬랙에서 보기
        </button>
      </div>
    ),
  },
];

export default function IntegratedTimeline() {
  const [filter, setFilter] = useState<string>("All");
  const sources = ["All", "Notion", "Figma", "GitHub", "Slack"];

  const filteredHistory =
    filter === "All"
      ? mockHistory
      : mockHistory.filter((item) => item.source === filter);

  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4 bg-white text-gray-900 font-sans">
      {/* 상단 카피 영역 */}
      <div className="text-center mb-16">
        <span className="text-sm font-semibold text-sky-600 tracking-wider uppercase block mb-3">
          흩어진 데이터를 하나로
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
          여기저기 흩어진 작업 히스토리,
          <br />
          이제 한 곳에서 한눈에 관리하세요.
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          노션, 피그마, 깃허브, 슬랙까지. 각 플랫폼을 번거롭게 이동할 필요 없이
          <br />
          우리 사이트에서 유기적으로 연결된 올인원 타임라인을 제공합니다.
        </p>
      </div>

      {/* 메인 인터랙티브 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 좌측 콘트롤 패널 (Instagram post - 1.png UI 스타일 차용) */}
        <div className="lg:col-span-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            연동된 워크스페이스
          </h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <button
                key={source}
                onClick={() => setFilter(source)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-left ${
                  filter === source
                    ? "bg-white shadow-sm border border-gray-200/80 font-semibold text-gray-900"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 각 브랜드 성격에 맞춘 인디케이터 컬러 블록 */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      source === "Notion"
                        ? "bg-amber-400"
                        : source === "Figma"
                          ? "bg-sky-400"
                          : source === "GitHub"
                            ? "bg-gray-800"
                            : source === "Slack"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                    }`}
                  />
                  <span className="text-sm">
                    {source === "All" ? "전체 히스토리 모아보기" : source}
                  </span>
                </div>
                {filter === source && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="text-xs text-sky-600 font-medium"
                  >
                    활성화됨
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/60 text-xs text-gray-400 space-y-2">
            <p>
              💡 탭을 클릭하여 각 플랫폼별 데이터 스트림이 실시간으로 동기화되는
              모습을 필터링해 보세요.
            </p>
          </div>
        </div>

        {/* 우측 메인 타임라인 영역 (Instagram post - 2.png & 3.png의 결합 구조) */}
        <div className="lg:col-span-8 relative pl-6 sm:pl-8">
          {/* 중앙 수직 타임라인 라인선 (Instagram post - 2.png 구조 시각화) */}
          <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gray-200" />

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group"
                >
                  {/* 타임라인 노드 아이콘 (Instagram post - 2.png의 원형 노드 반영) */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center group-hover:border-sky-500 transition-colors z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-sky-500 transition-colors" />
                  </div>

                  {/* 메인 히스토리 피드 카드 (Instagram post - 1, 3.png 종합 구조) */}
                  <div className="bg-white border border-gray-200/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    {/* 상단 헤더: 작성자 정보 및 서비스 태그 (Instagram post - 1.png 상단부 구조) */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* 더미 아바타 영역 (원형 프로필) */}
                        <div
                          className={`w-7 h-7 rounded-full ${item.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shadow-inner`}
                        >
                          {item.user.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800">
                            {item.user}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {item.time}
                          </span>
                        </div>
                      </div>

                      {/* 우측 상단 소스 뱃지 */}
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          backgroundColor: `${item.brandColor}15`,
                          color: item.brandColor,
                        }}
                      >
                        {item.source}
                      </span>
                    </div>

                    {/* 본문 콘텐츠 */}
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed break-all">
                      {item.description}
                    </p>

                    {/* 옵셔널 태그 리스트 (Notion 카드 등에서 활용) */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 확장 레이아웃 (Figma 프리뷰, Slack 전송창 스타일 하단 뷰 구현) */}
                    {item.extraContent && item.extraContent}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                해당 플랫폼의 최근 작업 히스토리가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
