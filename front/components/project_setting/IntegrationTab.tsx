import { useState } from "react";
import AppIntegrationSet from "@/components/project_setting/AppIntegrationSet";
import {
  FIGMA_REDIRECT_URL,
  GITHUB_REDIRECT_URL,
  NOTION_REDIRECT_URL,
  SLACK_REDIRECT_URL,
} from "@/lib/constant";
import NotionIcon from "../share/svg_icon/NotionIcon";
import GithubIcon from "../share/svg_icon/GithubIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import SlackIcon from "../share/svg_icon/SlackIcon";
import CstAlert from "../share/CstAlert";
import { BadgeAlert } from "lucide-react";

interface Scopes {
  title: string;
  desc: string;
}

interface RedirectConfig {
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
        desc: "선택한 브랜치의 최근 커밋 상세 내용을 작업라인에 표시합니다.",
      },
    ],
    permission: ["repo", "read:user"].join(" "),
    extraParams: {},
  },
  Figma: {
    auth: "https://www.figma.com/oauth",
    url: FIGMA_REDIRECT_URL,
    icon: <FigmaIcon />,
    scopes: [
      {
        title: "프로젝트 파일 리스트",
        desc: "디자인 파일 목록을 조회하여 워크스페이스와 연동합니다.",
      },
      {
        title: "버전 히스토리 및 댓글",
        desc: "디자인 수정 이력과 팀원들이 남긴 코멘트를 실시간으로 동기화합니다.",
      },
    ],
    permission: ["file_read"].join(","),
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
        title: "개인 및 공유 페이지 목록",
        desc: "유저가 선택하여 권한을 부여한 페이지 리스트를 불러옵니다.",
      },
      {
        title: "하위 페이지 변경 및 댓글 이력",
        desc: "선택한 페이지 하위의 문서 추가 이력과 댓글을 가져옵니다.",
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
        title: "채널 리스트 조회",
        desc: "워크스페이스 내부의 공개 채널 목록을 가져옵니다.",
      },
      {
        title: "채널 메시지 히스토리",
        desc: "선택한 채널의 실시간 대화 피드 및 메시지 이력을 페이징하여 읽어옵니다.",
      },
    ],
    permission: ["channels:read", "channels:history"].join(","),
    extraParams: {},
  },
};

export default function IntegrationTab() {
  const [activeTab, setActiveTab] = useState("Github");
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
    const filteredValue = value.replace(/[^a-zA-Z0-9\-_]/g, "");

    setInputs({
      ...inputs,
      [name]: filteredValue,
    });
  };

  const appConnectHanlder = async () => {
    if (!clientId || !clientSecret) {
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
        message: "연동을 위한 clientId와 clientSecret을 모두 입력해주세요",
      }));
      return;
    }

    try {
      const response = await fetch("/api/prepare/" + activeTab.toLowerCase(), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId,
          clientSecret: clientSecret,
        }),
      });

      const data = await response.json();
      const state = data.state;

      const param = new URLSearchParams();

      param.append("client_id", clientId);
      param.append("redirect_uri", APPCONNECT[activeTab].url);
      param.append("state", encodeURIComponent(state));

      if (APPCONNECT[activeTab].permission) {
        param.append("scope", APPCONNECT[activeTab].permission);
      }

      Object.entries(APPCONNECT[activeTab].extraParams).forEach(
        ([key, value]) => {
          param.append(key, value);
        },
      );

      const finalAuthRequestUrl = `${APPCONNECT[activeTab].auth}?${param.toString()}`;
      console.log("앱 연동 요청 url: " + finalAuthRequestUrl);

      window.location.href = finalAuthRequestUrl;
    } catch (err) {
      console.log(activeTab + "인증 중 에러 발생: " + err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <CstAlert
        onClose={alertConfig.onClose}
        type={alertConfig.type}
        message={alertConfig.message}
        isOpen={alertConfig.isOpen}
      />
      <div className="space-y-2">
        {["Github", "Figma", "Slack", "Notion"].map((tab) => (
          <button
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
              <span className="ml-3 bg-[var(--status-blocked)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
                미연동
              </span>
            </span>
          </button>
        ))}
      </div>
      {/** */}
      <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-6 shadow-sm">
        <div>
          {APPCONNECT[activeTab].icon}
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-wide mb-[1.7px] mt-1">
            {activeTab} 연동
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            작업을 불러오기 위해 어플리케이션 자격 정보 동기화 후 불러옵니다.
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
                value={label === "clientId" ? clientId : clientSecret}
                onChange={inputsHandle}
                type={label === "clientId" ? "text" : "password"}
                className="w-full bg-[var(--muted)] border border-[var(--muted)] rounded-lg py-3 px-4 text-sm text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder={`${label} 을 입력 해주세요`}
              />
            </div>
          ))}
          <button
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            onClick={appConnectHanlder}
          >
            Save Configuration
          </button>
        </div>
        {/** */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[var(--status-blocked)] text-[var(--primary-foreground)] text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
              필수
            </span>
            <span className="text-[13px] font-bold text-[var(--primary)] uppercase">
              연동 전 꼭 확인해주세요!
            </span>
          </div>
          <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed font-medium">
            정상적으로 연동을 위해 애플리케이션 설정 👉 redirect Url 란 아래
            주소를 추가해주세요.
          </p>
          <div className="border border-[var(--border)] rounded-xl overflow-hidden mt-4 bg-[var(--muted)]/40">
            <AppIntegrationSet
              app={activeTab.toLowerCase()}
              redirectUrl={APPCONNECT[activeTab].url}
            />
          </div>
        </div>
        {/** */}
        <div className="p-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span>
                <BadgeAlert size={16} />
              </span>
              <h3 className="font-bold text-[var(--foreground)]">
                {activeTab} 접근 요구 범위
              </h3>
            </div>

            <div className="space-y-4">
              {APPCONNECT[activeTab].scopes.map((scope, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start bg-[var(--sidebar-primary)]/5 border border-[var(--sidebar-border)]/40 p-3 rounded-xl"
                >
                  <div className="text-green-500 font-bold mt-0.5 text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {scope.title}
                    </h4>
                    <p className="text-sm text-[var(--sidebar-foreground)]/70 mt-0.5 leading-relaxed">
                      {scope.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[12px] text-gray-400 mt-6 leading-relaxed">
              * 본 서비스는 읽기 권한만 요구하며 유저의 명시적인 동의 없이
              데이터를 임의로 수정하거나 변조하지 않습니다.
            </p>
          </div>
        </div>
        {/** */}
      </div>
    </div>
  );
}
