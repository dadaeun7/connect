"use client";

import { ChevronDown, ExternalLink, User } from "lucide-react";

export default function IssueRow({ title, isTable = false }: { title: string, isTable?: boolean }) {
  return (
    <div className="bg-[#121212] rounded-xl border border-white/[0.03] overflow-hidden group hover:border-[#00FFA3]/20 transition-all">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" />
          <span className="text-sm font-bold text-white/90">{title}</span>
        </div>
        
        <div className="flex gap-2 items-center">
          <span className="bg-[#00FFA3]/5 text-[#00FFA3] px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border border-[#00FFA3]/10">In Progress</span>
          <span className="bg-white/5 text-gray-500 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border border-white/5 italic">Medium</span>
          <ChevronDown size={14} className="text-gray-600 ml-2" />
        </div>
      </div>
      
      {isTable && (
        <div className="px-4 pb-4">
          <div className="bg-black/30 rounded-xl border border-white/[0.02] overflow-hidden">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01]">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] opacity-50">🐙</span>
                   <span className="text-[11px] text-gray-400 font-medium">Repository Update Content...</span>
                   <ExternalLink size={10} className="text-[#00FFA3] opacity-50" />
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-mono text-[9px]">
                  <div className="w-5 h-5 bg-[#222] rounded-full border border-white/5" />
                  <span>2026.04.29</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}