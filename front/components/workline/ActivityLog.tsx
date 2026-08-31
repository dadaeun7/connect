import { ExternalLink } from "lucide-react";
import GithubIcon from "../share/svg_icon/GithubIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import NotionIcon from "../share/svg_icon/NotionIcon";
import { ActivityResponse } from "@/app/store/useIssueStore";
import { Tooltip } from "../share/ToolTip";
import { offsetTimeToLocalTime } from "../share/UtilFun";

const SERVICE_COLORS = {
  GITHUB: {
    icon: <GithubIcon />,
  },
  FIGMA: {
    icon: <FigmaIcon />,
  },
  NOTION: {
    icon: <NotionIcon />,
  },
} as const;

type AppType = keyof typeof SERVICE_COLORS; // 'GITHUB' | 'FIGMA' | 'NOTION'

export default function ActivityLog({
  activity,
}: Readonly<{
  activity: ActivityResponse[];
}>) {
  return (
    <div>
      {activity.length > 0 && (
        <div className="px-3 pb-3">
          <div className="bg-[var(--muted)]/50 overflow-hidden">
            {activity.map((item, i) => {
              const key = item.appType;
              const itemSvc = SERVICE_COLORS[key as AppType].icon;

              const desc = item.activityContent.split("제목:")[0];
              const title = item.activityContent.split("제목:")[1];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3.5 py-1 border-b border-[var(--border)]/30 last:border-0 hover:bg-[var(--foreground)]/5 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[12px] font-black uppercase px-1.5 py-0.5 rounded shrink-0">
                      {itemSvc}
                    </span>
                    <span className="text-[13.5px] text-[var(--foreground)]/70 font-medium truncate">
                      {item.activityTitle} {desc}
                    </span>
                    <div className="flex text-[12.9px] text-[var(--foreground)]/70 px-2 py-1 bg-[var(--foreground)]/5 rounded-lg items-center gap-1">
                      <div>{title ? title : "바로가기"}</div>
                      <div>
                        <Tooltip content="해당 페이지 확인하기">
                          <a
                            href={item.originUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink
                              size={15}
                              className="text-[var(--foreground)]/70 shrink-0 cursor-pointer hover:text-[var(--muted-foreground)] transition-colors"
                            />
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-[var(--muted-foreground)] font-mono shrink-0 ml-3">
                    <span className="text-[12px] text-[var(--muted-foreground)]">
                      {offsetTimeToLocalTime(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
