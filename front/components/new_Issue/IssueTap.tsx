"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { MenuKey } from "./MainNewIssue";

export default function IssueTap({
  menu,
  setCurStateMenu,
}: Readonly<{
  menu: string[];
  setCurStateMenu: Dispatch<SetStateAction<MenuKey>>;
}>) {
  const [activeTab, setActiveTab] = useState("전체");

  return (
    <div className="flex gap-8 border-b border-[var(--border)] mb-3 px-1">
      {menu.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setCurStateMenu(tab as MenuKey);
          }}
          className={`pb-3 text-sm font-bold tracking-wider transition-all relative uppercase ${
            activeTab === tab
              ? "text-[var(--primary)] font-black"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--primary)]" />
          )}
        </button>
      ))}
    </div>
  );
}
