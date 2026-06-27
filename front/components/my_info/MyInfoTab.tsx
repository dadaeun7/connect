import { ImageUp } from "lucide-react";

const MyInfoTab = () => {
  const inputStyle =
    "w-full bg-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium transition-colors";
  const labelStyle =
    "block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 px-0.5";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
      {/* 개인 정보 구역 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="w-1 h-4 bg-[var(--primary)] rounded-full" /> 개인
          정보
        </h3>
        <button className="text-[10px] font-black text-[var(--primary)] border border-[var(--primary)]/30 px-3 py-1 rounded-md hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all uppercase tracking-wide">
          외부 연동
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4 pl-1">
        <div className="relative col-span-1 w-fit">
          <img src="/logo.png" className="block" />
          <button className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 bg-white p-1 rounded-full shadow-md">
            <ImageUp size={19} className="cursor-pointer" />
          </button>
        </div>
        <div className="col-span-2">
          <label className={labelStyle}>이름</label>
          <input className={inputStyle} value="테스트" />
        </div>
        <div className="col-span-3">
          <label className={labelStyle}>이메일 주소</label>
          <input
            className={inputStyle}
            value="test@gmail.com"
            disabled={true}
            readOnly
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <button className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4">
          비밀번호 변경
        </button>
        <button className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-wide underline underline-offset-4">
          회원 탈퇴
        </button>
      </div>

      <div className="flex-1 h-[1px] bg-[var(--border)]/60" />

      {/* 회사 정보 구역 */}
      <h3 className="text-base font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-[var(--primary)] rounded-full" /> 회사 정보
      </h3>
      <div className="space-y-4">
        <div>
          <label className={labelStyle}>사업자 번호</label>
          <input className={inputStyle} placeholder="000-00-00000" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>회사 이름</label>
            <input
              className={inputStyle}
              placeholder="회사 이름을 입력하세요"
            />
          </div>
          <div>
            <label className={labelStyle}>대표자</label>
            <input className={inputStyle} placeholder="대표자 성함" />
          </div>
        </div>
      </div>
      <button className="mt-6 w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-black py-4 rounded-lg uppercase tracking-wider text-xs shadow-sm hover:opacity-95 transition-opacity">
        저장하기
      </button>
    </div>
  );
};

export default MyInfoTab;
