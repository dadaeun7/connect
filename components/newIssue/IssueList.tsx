"use client";

import { ChevronDown, Send, User } from "lucide-react";
import { useState } from "react";


interface Issue {
    id: number;
    title: string;
    status: string;
    date: string;
    contents?: string[];
}

export default function IssueList({list}:{list:Issue[]}) {

    const [expandedId, setExpandedId] = useState<number | null>(3);
    
    return(
    <div className="space-y-4">
        {list.map((issue) => (
          <div key={issue.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between p-6 gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-mono text-[#00FFA3] font-bold">
                    {issue.id}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg tracking-tight">{issue.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        issue.status === '검토전' ? 'bg-red-500/10 text-red-500' : 'bg-[#FFF500]/10 text-[#FFF500]'
                    }`}>{issue.status}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 block font-mono uppercase tracking-widest">{issue.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="bg-white/5 hover:bg-red-500/10 hover:text-red-500 px-3 py-2 rounded-lg text-[10px] font-black transition-all">DELETE</button>
                <button className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-[10px] font-black transition-all">MERGE</button>
                {issue.status !== '검토전' && (
                  <button 
                    onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                    className={`p-2 rounded-lg transition-all ${expandedId === issue.id ? 'bg-[#00FFA3] text-black' : 'bg-white/5 text-white'}`}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === issue.id ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* 아코디언 내용: 이미지의 하위 리스트 디자인 적용 */}
            {expandedId === issue.id && issue.contents && (
              <div className="px-6 pb-6 space-y-3 animate-fadeIn">
                <div className="h-[1px] bg-white/5 mb-4" />
                {issue.contents.map((content, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:border-[#00FFA3]/30">
                    <span className="text-xs text-gray-300 leading-relaxed">{content}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-[10px]"><User size={12}/></div>
                      <span className="text-[9px] text-gray-600 font-mono tracking-tighter uppercase">2026-04-30</span>
                    </div>
                  </div>
                ))}
                
                {/* 하단 입력바: 플로팅 캡슐 디자인 */}
                <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="bg-black border border-[#00FFA3]/20 rounded-2xl p-3 flex gap-3 items-center">
                        <input placeholder="Add a comment..." className="flex-1 bg-transparent text-xs py-2 px-3 outline-none" />
                        <button className="bg-[#00FFA3] text-black p-2 rounded-xl hover:scale-105 transition-transform">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )

}