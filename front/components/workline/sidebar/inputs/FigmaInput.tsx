import { FigmaState } from "@/app/project/[projectId]/workline/page";
import CstAlert from "@/components/share/CstAlert";
import FigmaIcon from "@/components/share/svg_icon/FigmaIcon";
import { SquareArrowOutUpRight } from "lucide-react";
import { useFigmaInput } from "../../hooks/useFigmaInput";

export default function FigmaInput({
  figmaFileUrl,
  figmaState,
  setFigmaFileUrl,
  setFigmaState,
  getFigmaState,
}: Readonly<{
  figmaFileUrl: string;
  figmaState: FigmaState | undefined;
  setFigmaFileUrl: (v: string) => void;
  setFigmaState: (s: FigmaState) => void;
  getFigmaState: (url: string) => Promise<FigmaState>;
}>) {
  const { alertConfig, loading, handleCheck } = useFigmaInput(
    figmaFileUrl,
    getFigmaState,
    setFigmaState,
  );

  return (
    <div className="bg-[var(--card)] space-y-3">
      <CstAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={alertConfig.onClose}
      />
      <div className="flex items-center justify-between font-bold text-sm text-[var(--foreground)]">
        <div className="flex items-center gap-2">
          <FigmaIcon /> Figma 파일 타겟팅(피그마 파일 URL을 직접 입력해주세요)
        </div>
        {/* 기존 UI를 해치지 않는 우측 상단 배치 */}
        {figmaFileUrl && (
          <button
            type="button"
            onClick={() => {
              setFigmaFileUrl("");
              if (setFigmaState)
                setFigmaState({
                  success: false,
                  fileKey: "",
                  name: "",
                  url: "",
                  message: "값을 지웠습니다.",
                });
            }}
            className="mr-3 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--task-rose)] font-bold transition-colors cursor-pointer"
          >
            연동 취소
          </button>
        )}
      </div>
      <div className="relative w-full flex items-center">
        {loading ? (
          "유효성 확인중.. "
        ) : (
          <input
            type="text"
            placeholder="예) https://www.figma.com/file/XYZ123456789/Project-Name?..."
            value={`https://www.figma.com/file/${figmaFileUrl}`}
            onChange={(e) => setFigmaFileUrl(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg pl-3 pr-28 py-[11.5px] text-[12px] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium"
          />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleCheck();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2
          px-4 py-2 text-[11px] font-black text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          유효성 확인
        </button>
      </div>
      {!loading && figmaState?.message && (
        <div
          className="text-sm font-semibold flex items-center gap-1"
          style={{
            color: figmaState?.success
              ? "var(--task-teal)"
              : "var(--task-rose)",
          }}
        >
          {figmaState?.success ? (
            <a
              href={figmaState.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-white border rounded hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer shadow-sm"
            >
              ✅유효합니다. 페이지 확인하기
              <SquareArrowOutUpRight size={10} className="ml-1" />
            </a>
          ) : (
            <span>❗{figmaState.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
