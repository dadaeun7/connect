import { useState } from "react";
import SlackSection from "./SlackSection";
import FigmaSection from "./FigmaSection";
import NotionSection from "./NotionSection";
import SlackIcon from "@/components/share/svg_icon/SlackIcon";
import FigmaIcon from "@/components/share/svg_icon/FigmaIcon";
import { Layers } from "lucide-react";
import { useAppStore } from "@/app/store/useAppStore";
import CstAlert from "@/components/share/CstAlert";

export default function GeneralTab() {
  const { appList } = useAppStore();
  // 1. 플랫폼 기본 데이터 및 초기 연동 상태 설정
  const [appPermissions] = useState([
    {
      id: "slack",
      name: "Slack",
      description: "채널 메시지와 봇 등록 방법",
      icon: <SlackIcon />,
      status: appList.includes("SLACK") ? "연동됨" : "미연동",
    },
    {
      id: "figma",
      name: "Figma",
      description: "파일 댓글과 히스토리 내역 조회",
      icon: <FigmaIcon />,
      status: appList.includes("FIGMA") ? "연동됨" : "미연동",
    },
    {
      id: "notion",
      name: "Notion",
      description: "워크스페이스 데이터베이스 연동",
      icon: <Layers className="w-5 h-5 text-[var(--foreground)]" />,
      status: appList.includes("NOTION") ? "연동됨" : "미연동",
    },
  ]);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "재 연결 중에 에러가 발생했습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const notionReConnect = async () => {
    try {
      const result = await fetch(`/notion/reconnect`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) throw new Error("notion re connect error ...");

      const data = await result.json();
      window.location.href = data.notionReConnectUrl;
    } catch (error) {
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
      }));
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
      <div>
        <h2 className="text-base font-bold text-[var(--foreground)]">
          연동 플랫폼 세부 권한
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] font-medium">
          각 외부 서비스의 필요한 권한을 확인해주세요.
        </p>
      </div>

      <div className="space-y-6">
        {appPermissions.map((app) => {
          if (app.id === "slack") {
            return <SlackSection key={app.id} app={app} />;
          }
          if (app.id === "figma") {
            return <FigmaSection key={app.id} app={app} />;
          }
          if (app.id === "notion") {
            return (
              <NotionSection
                key={app.id}
                app={app}
                onSave={() => notionReConnect()}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
