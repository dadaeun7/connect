"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestAnimationFrame을 활용해 브라우저 렌더링 프레임 이후로 실행을 미룹니다.
    // 이렇게 하면 Effect 본문에서 즉시 동기적으로 setState를 치는 구조를 회피할 수 있습니다.
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // 마운트되기 전(서버 렌더링 시점)에는 껍데기(UI 레이아웃만 유지) 혹은 null을 반환하여 불일치를 방지합니다.
  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] opacity-50"
        aria-hidden="true"
      />
    );
  }
  return (
    <div
      className="p-1 scale-65 rounded-xl justify-center gap-1.5 flex border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_rgba(0,0,0,0.01)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      aria-label="Toggle theme switcher"
    >
      {/* 라이트 모드 (Sun) 버튼 셀렉터 */}
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center gap-2.5 rounded-xl transition-all h-10 w-10 group ${
          theme === "light"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
            : "bg-transparent text-[var(--muted-foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <Sun
          className={`w-4 h-4 ${theme === "light" ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]/50 group-hover:text-[var(--primary)] transition-colors"}`}
        />
      </button>

      {/* 다크 모드 (Moon) 버튼 셀렉터 */}
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center gap-2.5 rounded-xl transition-all h-10 w-10 group ${
          theme === "dark"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
            : "bg-transparent text-[var(--muted-foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <Moon
          className={`w-4 h-4 ${theme === "dark" ? "text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]/50 group-hover:text-[var(--primary)] transition-colors"}`}
        />
      </button>
    </div>
  );
}
