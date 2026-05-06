"use client";

export default function IssueRow({ title, isTable = false }: { title: string, isTable?: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-3 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold">{title}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 opacity-60"> {/* 아이콘들 */}
            <span>🐙</span><span>💬</span><span>📝</span><span>🎨</span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">In Progress</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">enhancement</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">medium</span>
          <button className="p-2 bg-gray-100 p-1 rounded"><img className="h-[6px]" src="/arrow.png" alt="Toggle" /></button>
        </div>
      </div>
      
      {/* 테이블 형태의 하위 리스트 (isTable일 때만 노출) */}
      {isTable && (
        <div className="p-2 border-t border-gray-100">
          <div className="bg-white rounded border border-gray-200 overflow-hidden text-[13px]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                   <span>🐙</span>
                   <span className="font-medium text-gray-700">content</span>
                   <button className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">이동 ↗</button>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <span>👤</span>
                  <span>2026-04-29 14:23:01</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}