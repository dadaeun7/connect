import { ChevronDown, ExternalLink, GitBranch } from "lucide-react";
import GithubIcon from "../share/svg_icon/GithubIcon";
import FigmaIcon from "../share/svg_icon/FigmaIcon";
import NotionIcon from "../share/svg_icon/NotionIcon";
import SlackIcon from "../share/svg_icon/SlackIcon";

const SERVICE_COLORS = {
  github: {
    icon: <GithubIcon />,
  },
  figma: {
    icon: <FigmaIcon />,
  },
  notion: {
    icon: <NotionIcon />,
  },
  slack: {
    icon: <SlackIcon />,
  },
};

type ServiceKey = keyof typeof SERVICE_COLORS;

export default function ActivityLog({
  title,
  isTable = false,
}: Readonly<{
  title: string;
  isTable?: boolean;
}>) {
  return (
    <div>
      {isTable && (
        <div className="px-3 pb-3">
          <div className="bg-[var(--muted)]/50 overflow-hidden">
            {[
              {
                service: "github" as ServiceKey,
                text: "Feat: Implement custom slack pipeline signature token verification filters",
                branch: "main",
                date: "2026.06.12",
              },
              {
                service: "figma" as ServiceKey,
                text: "Design: Update component library for new token schema",
                branch: "feat/design-system",
                date: "2026.06.15",
              },
            ].map((item, i) => {
              const itemSvc = SERVICE_COLORS[item.service];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--border)]/30 last:border-0 hover:bg-[var(--foreground)]/5 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[12px] font-black uppercase px-1.5 py-0.5 rounded shrink-0">
                      {itemSvc.icon}
                    </span>
                    <span className="text-[13.5px] text-[var(--muted-foreground)] font-medium truncate">
                      {item.text}
                    </span>
                    <ExternalLink
                      size={11}
                      className="text-[var(--muted-foreground)]/30 shrink-0 cursor-pointer hover:text-[var(--muted-foreground)] transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 text-[var(--muted-foreground)] font-mono shrink-0 ml-3">
                    <div className="flex items-center gap-1 bg-[var(--muted)] border border-[var(--border)]/60 px-2 py-0.5 rounded text-[12.3px]">
                      <GitBranch size={10} />
                      <span>{item.branch}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--muted-foreground)]/40">
                      {item.date}
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
