"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GithubIcon from "../share/svg_icon/GithubIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import NotionIcon from "../share/svg_icon/NotionIcon";
import SlackIcon from "../share/svg_icon/SlackIcon";

interface ServiceCardSliderProps {
  activeIndex: number; // 0: Slack, 1: Figma, 2: Notion, 3: GitHub
}

export default function ServiceCardSlider({
  activeIndex,
}: Readonly<ServiceCardSliderProps>) {
  const cards = [
    {
      id: 0,
      title: "슬랙",
      icon: <SlackIcon />,
      bgVar: "var(--slack-bg)",
      borderVar: "var(--slack-border)",
      renderContent: () => (
        <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-sm relative">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-amber-500 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-5/6" />
            </div>
          </div>
          <div className="flex gap-2 pl-11 mt-2">
            <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded-full w-14" />
            <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded-full w-20" />
          </div>
          <div className="flex items-start gap-3 mt-4">
            <div className="w-8 h-8 rounded bg-sky-400 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
              <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-full" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "피그마",
      icon: <FigmaIcon />,
      bgVar: "var(--figma-bg)",
      borderVar: "var(--figma-border)",
      renderContent: () => (
        <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-sm relative">
          <div className="h-5 bg-gray-100 dark:bg-zinc-800 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
            <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
            <div className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
          </div>
          <div className="absolute bottom-3 right-5 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-3 py-1.5 shadow-md">
            <div className="w-4 h-4 rounded-full bg-sky-500" />
            <div className="h-2.5 bg-gray-200 dark:bg-zinc-600 rounded w-20" />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "노션",
      icon: <NotionIcon />,
      bgVar: "var(--notion-bg)",
      borderVar: "var(--notion-border)",
      renderContent: () => (
        <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-5 shadow-sm relative space-y-4">
          <div className="items-center mb-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-zinc-700 rounded shrink-0 mb-1" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
          </div>
          <div className="py-2 space-y-2 border-t border-gray-100 dark:border-zinc-800">
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-amber-100 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50 rounded w-full" />
          </div>
          <div className="absolute bottom-2 right-5 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 shadow-lg w-2/3">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <div className="h-2.5 bg-gray-200 dark:bg-zinc-600 rounded flex-1" />
            <div className="h-2.5 bg-gray-100 dark:bg-zinc-700 rounded w-10" />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "깃허브",
      icon: <GithubIcon />,
      bgVar: "var(--github-bg)",
      borderVar: "var(--github-border)",
      renderContent: () => (
        <div className="w-full border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-5 shadow-sm relative space-y-4">
          <div className="flex gap-4 relative">
            <div className="flex flex-col items-center shrink-0 w-3 relative">
              <div className="w-[1.5px] h-2 bg-gray-200 dark:bg-zinc-800" />

              {/* 중앙 깃허브 스타일 노드 (중앙 원 + 좌우 가로선) */}
              <div className="relative w-3 h-3 flex items-center justify-center z-10">
                {/* 가로 관통선 */}
                <div className="absolute w-4 h-[1.5px] bg-zinc-900 dark:bg-white" />
                {/* 중앙 흰색 원 (테두리는 어두운 톤) */}
                <div className="absolute w-2 h-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-white" />
              </div>
              {/* 다음 아이템으로 이어지는 하단 라인 */}
              <div className="w-[1.5px] flex-1 bg-gray-200 dark:bg-zinc-800" />
            </div>
            {/* 우측 콘텐츠 */}
            <div className="flex-1 space-y-2 pb-1">
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-700 rounded w-2/3" />
              <div className="border border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 rounded-lg p-3 h-12 w-full" />
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="flex flex-col items-center shrink-0 w-3 relative">
              {/* 이전 아이템에서 내려오는 상단 라인 */}
              <div className="w-[1.5px] h-2 bg-gray-200 dark:bg-zinc-800" />
              {/* 중앙 깃허브 스타일 노드 */}
              <div className="relative w-3 h-3 flex items-center justify-center z-10">
                <div className="absolute w-4 h-[1.5px] bg-zinc-900 dark:bg-white" />
                <div className="absolute w-2 h-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-white" />
              </div>
              {/* 하단 꼬리 라인 */}
              <div className="w-[1.5px] h-8 bg-gray-200 dark:bg-zinc-800" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
              <div className="border border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 rounded-lg p-3 h-12 w-full" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentCard = cards[activeIndex];

  return (
    <div className="w-full max-w-xl mx-auto h-[220px] relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          // 텍스트 전환 애니메이션과 싱크를 맞춰 위에서 아래로 미끄러지는 효과 설정
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="absolute inset-0 p-6 flex flex-col items-start justify-between"
        >
          {/* 내부 목업 콘텐츠 콘텐츠 */}
          <div className="w-full flex-1 flex items-center relative z-10">
            {currentCard.renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
