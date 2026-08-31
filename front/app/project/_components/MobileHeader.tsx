"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import Sidebar from "@/components/share/SideBar";

interface MobileHeaderProps {
  readonly showMenu: boolean;
}

export default function MobileHeader({ showMenu }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="flex md:hidden items-center justify-between px-4 py-2 bg-[var(--sidebar)] border-b border-[var(--sidebar-border)] shrink-0 z-30">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors"
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--sidebar)] flex flex-col md:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--sidebar-border)]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]"
              aria-label="메뉴 닫기"
            >
              <X size={20} />
            </button>
          </div>

          <button
            type="button"
            className="flex-1 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <Sidebar showMenu={showMenu} />
          </button>
        </div>
      )}
    </>
  );
}
