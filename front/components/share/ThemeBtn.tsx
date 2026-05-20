"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 💡 서버 사이드 렌더링 시점과 브라우저 마운트 시점의 테마 불일치 에러를 방지합니다.
  useEffect(() => {
    setMounted(true);
  }, []);

  // 구글 머티리얼 디자인 가이드라인 기준: 시인성이 확보된 대형 여백 컴포넌트 스케일 처리
  if (!mounted) return <div className="w-[80px] h-[52px]" />; // 마운트 전 깜빡임 방지용 빈 공간

  return (
    <div
      className="p-1 scale-65 rounded-xl justify-center gap-1.5 flex border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_rgba(0,0,0,0.01)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      //   className="scale-80 inline-flex justify-center items-center gap-1.5 py-1.5 px-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_rgba(0,0,0,0.01)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      aria-label="Toggle theme switcher"
    >
      {/* 라이트 모드 (Sun) 버튼 셀렉터 */}
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center gap-2.5 rounded-xl transition-all h-10 w-24 group ${
          theme === "light"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
            : "bg-transparent text-[var(--muted-foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <Sun
          className={`w-4 h-4 ${theme === "light" ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]/50 group-hover:text-[var(--primary)] transition-colors"}`}
        />
        <span className="text-xs font-black uppercase tracking-wider">
          Light
        </span>
      </button>

      {/* 다크 모드 (Moon) 버튼 셀렉터 */}
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center gap-2.5 rounded-xl transition-all h-10 w-24 group ${
          theme === "dark"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
            : "bg-transparent text-[var(--muted-foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <Moon
          className={`w-4 h-4 ${theme === "dark" ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]/50 group-hover:text-[var(--primary)] transition-colors"}`}
        />
        <span className="text-xs font-black uppercase tracking-wider">
          Dark
        </span>
      </button>
    </div>
  );
}
