import { ChevronDown, Mail, Search } from "lucide-react";

export default function GeneralTab() {
return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Project Info Section */}
      <section>
        <div className="flex items-center gap-4 mb-6 px-2">
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-white">Project Info</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Project 정보를 확인하고 수정합니다.</p>
          </div>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">이름</label>
            <input 
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#00FFA3]/50 focus:outline-none transition-all" 
              placeholder="Workspace 이름" 
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-[#111] border border-white/10 text-white text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-[#00FFA3] hover:text-black transition-all">
              확인 및 저장
            </button>
          </div>
        </div>
      </section>

      {/* Member Info Section */}
      <section>
        <div className="flex items-center gap-4 mb-6 px-2">
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-white">Member Info</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">나의 Project 에 초대된 인원들을 확인합니다.</p>
          </div>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* Invite Input Row */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00FFA3] transition-colors" />
            <input 
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#00FFA3]/50 focus:outline-none transition-all" 
              placeholder="test@gmail.com" 
            />
          </div>
          <div className="relative min-w-[140px]">
            <select className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00FFA3]/50 focus:outline-none appearance-none">
              <option>권한 선택</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>
          <button className="bg-[#00FFA3] text-black text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,163,0.2)]">
            초대
          </button>
        </div>

        {/* Member Table */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">멤버 목록</span>
            <Search className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-600 tracking-tighter">
                  <th className="p-4">이름</th>
                  <th className="p-4">권한</th>
                  <th className="p-4 text-right">멤버</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* 데이터 예시 */}
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                  <td className="p-4 text-white font-medium">홍길동 (나)</td>
                  <td className="p-4">
                    <span className="text-[#00FFA3] text-[10px] font-black border border-[#00FFA3]/30 px-2 py-0.5 rounded">ADMIN</span>
                  </td>
                  <td className="p-4 text-right text-gray-500">Owner</td>
                </tr>
              </tbody>
            </table>
            <div className="h-32 bg-gradient-to-b from-transparent to-black/20 flex items-center justify-center">
              <p className="text-xs text-gray-700 uppercase font-black tracking-widest">End of Member List</p>
            </div>
          </div>
        </div>
      </section>

      {/* Invite History Section */}
      <section>
        <div className="flex items-center gap-4 mb-6 px-2">
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-white">Invite History</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">멤버 초대 관련 히스토리 입니다.</p>
          </div>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.5)]" />
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-[#00FFA3] transition-colors">invite_user_{i}@gmail.com</p>
                  <p className="text-[10px] text-gray-600 font-black uppercase">Invitation Sent</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-tighter italic">Pending</p>
                <p className="text-[10px] text-gray-600">April 29, 2026</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}