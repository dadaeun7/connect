import { useState } from "react";
import SlackSection from "./SlackSection";
import FigmaSection from "./FigmaSection";
import NotionSection from "./NotionSection";
import SlackIcon from "@/components/share/svg_icon/SlackIcon";
import FigmaIcon from "@/components/share/svg_icon/FigmaIcon";
import { Layers } from "lucide-react";

export default function GeneralTab() {
  // 1. 플랫폼 기본 데이터 및 초기 연동 상태 설정
  const [appPermissions] = useState([
    {
      id: "slack",
      name: "Slack",
      description: "채널 메시지 및 콘텐츠 동기화 파이프라인",
      icon: <SlackIcon />,
      status: "연동됨",
    },
    {
      id: "figma",
      name: "Figma",
      description: "팀 프로젝트 및 파일 메타데이터 조회",
      icon: <FigmaIcon />,
      status: "연동됨",
    },
    {
      id: "notion",
      name: "Notion",
      description: "워크스페이스 페이지 및 데이터베이스 연동",
      icon: <Layers className="w-5 h-5 text-[var(--foreground)]" />,
      status: "연동됨",
    },
  ]);

  // 2. 권한 및 피그마 URL 제어용 상태 관리
  const [selectedScopes, setSelectedScopes] = useState<
    Record<string, string[]>
  >({
    slack: ["channels:history", "groups:history"],
    figma: ["projects:read"],
  });
  const [figmaUrl, setFigmaUrl] = useState(
    "https://www.figma.com/files/team/{팀 아이디}/drafts?fuid=...",
  );

  // 공통 체크박스 핸들러
  const handleScopeChange = (appId: string, scopeValue: string) => {
    setSelectedScopes((prev) => {
      const current = prev[appId] || [];
      const updated = current.includes(scopeValue)
        ? current.filter((s) => s !== scopeValue)
        : [...current, scopeValue];
      return { ...prev, [appId]: updated };
    });
  };

  // 공통 다시 요청 요청 핸들러
  const handleSaveRequest = (appId: string) => {
    const payload = {
      appId,
      scopes: selectedScopes[appId],
      ...(appId === "figma" && { teamUrl: figmaUrl }),
    };

    console.log(`${appId} 저장/재인증 요청 데이터:`, payload);
    alert(`${appId.toUpperCase()} 변경된 설정으로 다시 요청을 진행합니다.`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-[var(--foreground)]">
          연동 플랫폼 세부 권한 관리
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          외부 플랫폼 API 동기화 파이프라인의 권한 범위 및 연결 상태를 한눈에
          관리합니다.
        </p>
      </div>

      <div className="space-y-6">
        {appPermissions.map((app) => {
          if (app.id === "slack") {
            return (
              <SlackSection
                key={app.id}
                app={app}
                selectedScopes={selectedScopes.slack || []}
                onScopeChange={(value) => handleScopeChange("slack", value)}
                onSave={() => handleSaveRequest("slack")}
              />
            );
          }
          if (app.id === "figma") {
            return (
              <FigmaSection
                key={app.id}
                app={app}
                figmaUrl={figmaUrl}
                setFigmaUrl={setFigmaUrl}
                selectedScopes={selectedScopes.figma || []}
                onScopeChange={(value) => handleScopeChange("figma", value)}
                onSave={() => handleSaveRequest("figma")}
              />
            );
          }
          if (app.id === "notion") {
            return (
              <NotionSection
                key={app.id}
                app={app}
                onSave={() => handleSaveRequest("notion")}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
