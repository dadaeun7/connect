import {
  GithubBranch,
  GithubRepo,
} from "@/app/project/[projectId]/workline/page";
import GithubIcon from "@/components/share/svg_icon/GithubIcon";
import { ChevronDown, ChevronUp, FolderRoot, GitBranch } from "lucide-react";

export default function GithubInput({
  githubRepo,
  githubBranch,
  setSelectedRepo,
  loading,
  gitRepoShow,
  setGitRepoShow,
  gitBranchShow,
  setGitBranchShow,
  curGitRepo,
  curGitBranch,
  setCurGitRepo,
  setCurGitBranch,
}: Readonly<{
  githubRepo: GithubRepo[];
  githubBranch: GithubBranch[];
  setSelectedRepo: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  gitRepoShow: boolean;
  setGitRepoShow: React.Dispatch<React.SetStateAction<boolean>>;
  gitBranchShow: boolean;
  setGitBranchShow: React.Dispatch<React.SetStateAction<boolean>>;
  curGitRepo: GithubRepo | null;
  curGitBranch: GithubBranch | null;
  setCurGitRepo: React.Dispatch<React.SetStateAction<GithubRepo | null>>;
  setCurGitBranch: React.Dispatch<React.SetStateAction<GithubBranch | null>>;
}>) {
  return (
    <div className="bg-[var(--card)] space-y-3">
      <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)] pb-2 border-b-1 border-b-[var(--sidebar-border)]">
        <GithubIcon /> GitHub 저장소
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="flex gap-1 text-xs font-black text-[var(--sidebar-foreground)] tracking-wider ml-1 mb-1">
            레파지토리
          </span>
          <div
            className="relative w-full flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-[12px] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium cursor-pointer"
            onClick={() => setGitRepoShow(!gitRepoShow)}
          >
            <div className="truncate pr-2">
              {curGitRepo ? (
                curGitRepo.full_name
              ) : (
                <span className="text-[var(--muted-foreground)]">
                  선택되지 않음
                </span>
              )}
            </div>
            <div className="text-[var(--muted-foreground)] shrink-0">
              {gitRepoShow ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {gitRepoShow && (
              <div className="absolute top-14 left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* 💡 선택 안 함 항목 배치 */}
                <div
                  className="py-2 px-2.5 text-[12px] font-bold text-[var(--task-rose)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors border-b border-[var(--border)] mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurGitRepo(null);
                    setCurGitBranch(null);
                    setSelectedRepo("");
                    setGitRepoShow(false);
                  }}
                >
                  🚫 연동 해제
                </div>
                {githubRepo.length > 0 &&
                  githubRepo.map((gr) => (
                    <div
                      key={gr.id}
                      className="py-2 px-2.5 text-[12px] font-bold text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurGitRepo(gr);
                        setSelectedRepo(gr.full_name);
                        setGitRepoShow(false);
                      }}
                    >
                      {gr.full_name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <span className="flex gap-1 text-xs font-black text-[var(--sidebar-foreground)] tracking-wider ml-1 mb-1">
            브랜치
          </span>
          <div
            className="relative w-full flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-[11.5px] text-[12px] bg-[var(--background)] focus:outline-none focus:border-[var(--primary)] font-medium cursor-pointer"
            onClick={() => !loading && setGitBranchShow(!gitBranchShow)}
          >
            <div className="truncate pr-2">
              {loading ? (
                "브랜치 불러오는 중..."
              ) : curGitBranch ? (
                curGitBranch.name
              ) : (
                <span className="text-[var(--muted-foreground)]">
                  선택되지 않음
                </span>
              )}
            </div>
            <div className="text-[var(--muted-foreground)] shrink-0">
              {gitBranchShow ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {gitBranchShow && !loading && (
              <div className="absolute top-14 left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* 💡 선택 안 함 항목 배치 */}
                <div
                  className="py-2 px-2.5 text-[12px] font-bold text-[var(--task-rose)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors border-b border-[var(--border)] mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurGitBranch(null);
                    setGitBranchShow(false);
                  }}
                >
                  🚫 브랜치 연결 해제
                </div>
                {githubBranch.length > 0 &&
                  githubBranch.map((gh, index) => (
                    <div
                      key={index}
                      className="py-2 px-2.5 text-[12px] font-bold text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurGitBranch(gh);
                        setGitBranchShow(false);
                      }}
                    >
                      {gh.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
