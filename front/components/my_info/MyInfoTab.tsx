const MyInfoTab = () => {
  const inputStyle =
    "w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00FFA3]/50 focus:ring-1 focus:ring-[#00FFA3]/50 transition-all";
  const labelStyle =
    "block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 px-1";

  return (
    <div className="space-y-16">
      {/* My Info Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
            <span className="w-1 h-5 bg-[#00FFA3]" /> 개인 정보
          </h3>
          <button className="text-[10px] font-black text-[#00FFA3] border border-[#00FFA3]/30 px-3 py-1 rounded hover:bg-[#00FFA3] hover:text-black transition-all uppercase">
            외부 연동
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>이름</label>
            <input className={inputStyle} value="홍길동" readOnly />
          </div>
          <div>
            <label className={labelStyle}>이메일 주소</label>
            <input className={inputStyle} value="test@gmail.com" readOnly />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest underline underline-offset-4">
            비밀번호 변경
          </button>
        </div>
      </section>

      {/* Company Info Section */}
      <section>
        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-5 bg-[#00FFA3]" /> 회사 정보
        </h3>
        <div className="space-y-6">
          <div>
            <label className={labelStyle}>회사 이름</label>
            <input
              className={inputStyle}
              placeholder="회사 이름을 입력하세요"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>대표자</label>
              <input className={inputStyle} placeholder="대표자 이름" />
            </div>
            <div>
              <label className={labelStyle}>사업자 번호</label>
              <input className={inputStyle} placeholder="000-00-00000" />
            </div>
          </div>
        </div>
        <button className="mt-10 w-full bg-[#00FFA3] text-black font-black py-4 rounded-xl uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)]">
          저장하기
        </button>
      </section>
    </div>
  );
};

export default MyInfoTab;
