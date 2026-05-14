const AffiliationTab = () => {
return (
    <div className="space-y-16">
      {/* Affiliation List Section */}
      <section>
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-lg font-black uppercase tracking-widest text-white">Current Affiliations</h3>
          <button className="text-gray-500 hover:text-white transition-colors">🔍</button>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-white/5">
                {['Project', 'Organization', 'Role'].map((head) => (
                  <th key={head} className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold">Connect Project</td>
                <td className="p-4 text-gray-400 font-medium">Internal Dev Team</td>
                <td className="p-4">
                  <span className="text-[#00FFA3] text-[10px] font-black border border-[#00FFA3]/20 px-2 py-0.5 rounded uppercase">Owner</span>
                </td>
              </tr>
              {/* 반복되는 행들... */}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="text-[10px] font-black text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-[0.1em]">
            Leave All Groups
          </button>
        </div>
      </section>

      {/* History Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Activity History</h3>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group flex justify-between items-center bg-[#111] border border-white/5 p-5 rounded-xl hover:border-[#00FFA3]/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/10 group-hover:border-[#00FFA3]/30">
                  <span className="text-[#00FFA3] text-xs font-black">#0{i}</span>
                </div>
                <div>
                  <p className="text-sm font-black text-white group-hover:text-[#00FFA3] transition-colors">Project Name</p>
                  <p className="text-[11px] font-medium text-gray-600 uppercase tracking-tighter">Company Name</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Changed</p>
                <p className="text-[10px] font-medium text-gray-600 italic">April 29, 2026</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AffiliationTab;