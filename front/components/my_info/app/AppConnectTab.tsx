import { useState } from "react";
import {
  FIGMA_REDIRECT_URL,
  GITHUB_REDIRECT_URL,
  NOTION_REDIRECT_URL,
  SLACK_REDIRECT_URL,
} from "@/lib/constant";
import NotionIcon from "../../share/svg_icon/NotionIcon";
import GithubIcon from "../../share/svg_icon/GithubIcon";
import FigmaIcon from "../../share/svg_icon/FigmaIcon";
import SlackIcon from "../../share/svg_icon/SlackIcon";
import CstAlert from "../../share/CstAlert";
import { useAppStore } from "@/app/store/useAppStore";
import AppIntegrationSet from "./AppAuthDescription";
import { useConfirmation } from "@/components/share/ConfirmationContext";

interface Scopes {
  title: string;
  desc: string;
}

export interface RedirectConfig {
  auth: string;
  url: string;
  icon: React.ReactNode;
  scopes: Scopes[];
  permission: string;
  extraParams: Object;
}

const APPCONNECT: Record<string, RedirectConfig> = {
  Github: {
    auth: "https://github.com/login/oauth/authorize",
    url: GITHUB_REDIRECT_URL,
    icon: <GithubIcon />,
    scopes: [
      {
        title: "리포지토리 및 브랜치 조회",
        desc: "연동된 저장소와 하위 브랜치 목록을 읽어옵니다.",
      },
      {
        title: "커밋 이력 읽기",
        desc: "선택한 브랜치의 최근 커밋 히스토리를 등록합니다.",
      },
      {
        title: "커밋 댓글 읽기",
        desc: "선택한 브랜치의 커밋 댓글 히스토리를 등록합니다.",
      },
    ],
    permission: ["repo", "read:user", "write:repo_hook"].join(" "),
    extraParams: {},
  },
  Figma: {
    auth: "https://www.figma.com/oauth",
    url: FIGMA_REDIRECT_URL,
    icon: <FigmaIcon />,
    scopes: [
      {
        title: "파일 메타 정보",
        desc: "파일 링크 기준으로 유효성을 검사하고 해당 파일키를 저장합니다.",
      },
      {
        title: "버전 히스토리 및 댓글",
        desc: "디자인 수정 이력과 팀원들이 남긴 코멘트를 실시간으로 동기화합니다.",
      },
    ],
    // scope 공식 문서: https://developers.figma.com/docs/rest-api/scopes/
    permission: [
      "file_comments:read",
      "file_metadata:read",
      "file_versions:read",
    ].join(","),
    extraParams: {
      response_type: "code",
    },
  },
  Notion: {
    auth: "https://api.notion.com/v1/oauth/authorize",
    url: NOTION_REDIRECT_URL,
    icon: <NotionIcon />,
    scopes: [
      {
        title: "데이터베이스 목록",
        desc: "유저가 선택하여 권한을 부여한 데이터베이스 리스트를 불러옵니다.",
      },
      {
        title: "데이터베이스 페이지 추가와 하위 페이지 수정 이력",
        desc: "선택한 데이터베이스 하위의 문서 추가 이력과 수정 이력을 가져옵니다.",
      },
    ],
    permission: "",
    extraParams: {
      response_type: "code",
      owner: "user",
    },
  },
  Slack: {
    auth: "https://slack.com/oauth/v2/authorize",
    url: SLACK_REDIRECT_URL,
    icon: <SlackIcon />,
    scopes: [
      {
        title: "채널 메시지 히스토리",
        desc: "봇을 등록한 공개 채널에 설정한 키워드가 포함된 메세지를 가져옵니다.",
      },
    ],
    permission: ["channels:read", "channels:history"].join(","),
    extraParams: {},
  },
};

export default function IntegrationTab({
  appConnectHanlder,
}: Readonly<{
  appConnectHanlder: (
    clientId: string,
    clientSecret: string,
    activeTab: string,
    APPCONNECT: RedirectConfig,
  ) => Promise<void>;
}>) {
  const [activeTab, setActiveTab] = useState("Github");

  const { connectedApps, appList } = useAppStore();
  const savedClientId = connectedApps[activeTab.toUpperCase()]?.clientId || "";
  const isLinked = appList.includes(activeTab.toUpperCase());

  const { openConfirm } = useConfirmation();

  const handleComfirm = () => {
    openConfirm({
      message: "연결 해제 이후 더 이상 히스토리는 수집되지 않습니다.",
      onConfirm: () => {
        unConnectService();
      },
      onCancel: () => {},
    });
  };

  const [inputs, setInputs] = useState({
    clientId: "",
    clientSecret: "",
  });

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const { clientId, clientSecret } = inputs;

  const inputsHandle = (e: any) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^a-zA-Z0-9\-_\.]/g, "");

    setInputs({
      ...inputs,
      [name]: filteredValue,
    });
  };

  const getInputValue = (label: string) => {
    if (isLinked) {
      return savedClientId;
    }
    return label === "clientId" ? clientId : clientSecret;
  };

  const unConnectService = async () => {
    if (!appList.includes(activeTab.toUpperCase())) return;
    try {
      const result = await fetch(
        `/app/delete?appType=${activeTab.toUpperCase()}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!result.ok) throw new Error("app unconnecting error ...");

      setAlertConfig((props) => ({
        ...props,
        type: "success",
        isOpen: true,
        message: "앱 연결이 정상적으로 해제 되었습니다.",
      }));

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
      <div className="space-y-2">
        {["Github", "Figma", "Slack", "Notion"].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full flex items-center justify-between py-4 px-5 rounded-xl border text-left text-sm transition-all ${
              activeTab === tab
                ? "bg-[var(--secondary)] border-[var(--muted-foreground)]/30 text-[var(--primary)] font-black shadow-sm"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/40"
            }`}
          >
            <span className="font-bold tracking-wider">
              {tab}
              {appList.includes(tab.toUpperCase()) ? (
                <span className="ml-3 bg-[var(--status-done)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
                  연동중
                </span>
              ) : (
                <span className="ml-3 bg-[var(--status-blocked)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
                  미연동
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {/** */}
      <div className="lg:col-span-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-6 shadow-sm">
        <div>
          <div className="flex justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-wide mb-[1.7px] mt-1">
              {APPCONNECT[activeTab].icon} {activeTab} 연동
            </h2>
            {appList.includes(activeTab.toUpperCase()) && (
              <button
                type="button"
                onClick={() => {
                  handleComfirm();
                }}
                className="px-5 my-[8.5px] border border-[var(--primary)] text-[var(--primary)] 
                font-bold rounded-lg text-[11px] shadow-sm hover:bg-[var(--primary)] hover:text-[var(--background)]
                transition-all uppercase cursor-pointer"
              >
                연결 해제
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            작업을 불러오기 위해서는 OAuth2 연동이 필요합니다.
          </p>
        </div>

        <div className="space-y-4 border-b border-[var(--border)] pb-5">
          {["clientId", "clientSecret"].map((label) => (
            <div key={label} className="flex flex-col space-y-2">
              <label className="text-[12px] font-bold text-[var(--card-foreground)] uppercase tracking-wider">
                {label === "clientId" ? "클라이언트 ID" : "클라이언트 시크릿"}
              </label>
              <input
                name={label}
                value={getInputValue(label)}
                onChange={inputsHandle}
                disabled={isLinked}
                type={label === "clientId" ? "text" : "password"}
                placeholder={`${label} 을 입력 해주세요`}
                className={`w-full border bg-[var(--muted)] border-[var(--muted)] rounded-lg py-3 px-4 text-sm text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors`}
              />
            </div>
          ))}
          <button
            type="button"
            disabled={isLinked}
            className="w-full disabled:bg-[var(--primary)]/50 bg-[var(--primary)] text-[var(--primary-foreground)] font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-md enabled:cursor-pointer"
            onClick={() => {
              if (!clientId || !clientSecret) {
                setAlertConfig((props) => ({
                  ...props,
                  isOpen: true,
                  message:
                    "연동을 위한 clientId와 clientSecret을 모두 입력해주세요",
                }));
                return;
              }
              appConnectHanlder(
                clientId,
                clientSecret,
                activeTab,
                APPCONNECT[activeTab],
              );
            }}
          >
            Save Configuration
          </button>
        </div>

        <AppIntegrationSet
          activeTab={activeTab}
          redirectUrl={APPCONNECT[activeTab].url}
          app={APPCONNECT[activeTab]}
        />
      </div>
    </div>
  );
}
