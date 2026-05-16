import {
  FileText,
  Layout,
  Zap,
  ChevronsLeftRightEllipsis,
  Send,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00FFA3] selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-black tracking-tighter uppercase group cursor-pointer">
          Connect
        </div>
        <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <a href="#" className="hover:text-[#00FFA3] transition-colors">
            작업 흐름
          </a>
          <a href="#" className="hover:text-[#00FFA3] transition-colors">
            통합 목록
          </a>
          <a href="#" className="hover:text-[#00FFA3] transition-colors">
            요금제
          </a>
        </div>
        <Link href={"/login"}>
          <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#00FFA3] transition-all">
            로그인
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-10 flex flex-col items-center text-center">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FFA3]/10 blur-[120px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#00FFA3]/20 bg-[#00FFA3]/5 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00FFA3]">
            Next.js 15 & Auth.js v5 Powered
          </span>
        </div>

        <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[1.1] uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          파편화 된 데이터
          <br />
          <span className="text-[#00FFA3]">통합된</span> 작업 흐름
        </h1>

        <p className="max-w-2xl text-gray-500 text-lg font-medium leading-relaxed mb-12">
          Slack의 휘발성 대화, Figma의 코멘트, Notion의 기획안을
          <br />
          <span className="text-white">하나의 타임라인</span>
          으로 통합합니다. 파편화된 협업의 끝, 개발자 경험(DX)의 완성.
        </p>

        <div className="flex gap-4">
          <button className="bg-[#00FFA3] text-black font-black px-8 py-4 rounded-xl text-sm uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,163,0.3)] hover:scale-105 active:scale-95 transition-all">
            데이터 연결하기 <ArrowRight size={18} />
          </button>
          <button className="bg-[#111] border border-white/10 text-white font-black px-8 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
            깃허브 보러가기
          </button>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="px-10 py-20 border-y border-white/5 bg-[#050505]">
        <div className="max-w-5xl mx-auto flex justify-between items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <ChevronsLeftRightEllipsis size={32} />
          <Send size={32} />
          <Layout size={32} /> {/* Figma 대체 */}
          <FileText size={32} /> {/* Notion 대체 */}
          <div className="text-xl font-black tracking-tighter">AUTH.JS</div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-10 py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="group">
          <div className="w-12 h-12 bg-[#111] border border-white/10 flex items-center justify-center rounded-xl mb-6 group-hover:border-[#00FFA3]/50 transition-all">
            <Zap className="text-[#00FFA3]" />
          </div>
          <h3 className="text-xl font-black uppercase mb-4">
            하나의 테스크로 인덱싱
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Webhook 연동을 통해 각 서비스의 데이터를 실시간으로 인덱싱하여
            하나의 테스크로 연결합니다.
          </p>
        </div>

        <div className="group">
          <div className="w-12 h-12 bg-[#111] border border-white/10 flex items-center justify-center rounded-xl mb-6 group-hover:border-[#00FFA3]/50 transition-all">
            <ChevronsLeftRightEllipsis className="text-[#00FFA3]" />
          </div>
          <h3 className="text-xl font-black uppercase mb-4">
            트리구조 데이터 모델
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            하나의 트리 구조로 시각화여 각 서비스의 정보가 누락 없는 협업 환경을
            제공합니다.
          </p>
        </div>

        <div className="group">
          <div className="w-12 h-12 bg-[#111] border border-white/10 flex items-center justify-center rounded-xl mb-6 group-hover:border-[#00FFA3]/50 transition-all">
            <Layout className="text-[#00FFA3]" />
          </div>
          <h3 className="text-xl font-black uppercase mb-4">경계 없는 작업</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            기획자, 디자이너, 개발자가 각자의 툴을 사용하면서도 하나의 라인
            안에서 소통할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Footer 모사 */}
      <footer className="px-10 py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
          Designed for high-performance development teams
        </p>
      </footer>
    </div>
  );
}
