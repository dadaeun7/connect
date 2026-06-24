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

const STATUS_COLORS = {
  "In Progress": {
    color: "var(--task-blue)",
    bg: "var(--task-blue-bg)",
  },
  Done: {
    color: "var(--task-teal)",
    bg: "var(--task-teal-bg)",
  },
  Blocked: {
    color: "var(--task-rose)",
    bg: "var(--task-rose-bg)",
  },
  Review: {
    color: "var(--task-amber)",
    bg: "var(--task-amber-bg)",
  },
};

type StatusKey = keyof typeof STATUS_COLORS;

const PRIORITY_COLORS = {
  High: { color: "var(--task-rose)", bg: "var(--task-rose-bg)" },
  Medium: { color: "var(--task-amber)", bg: "var(--task-amber-bg)" },
  Low: { color: "var(--task-teal)", bg: "var(--task-teal-bg)" },
};

type PriorityKey = keyof typeof PRIORITY_COLORS;

export default function IssueRow({
  title,
  isTable = false,
  service,
  status = "In Progress",
  priority = "Medium",
}: {
  title: string;
  isTable?: boolean;
  service?: ServiceKey;
  status?: StatusKey;
  priority?: PriorityKey;
}) {
  const svc = service ? SERVICE_COLORS[service] : null;
  const statusStyle = STATUS_COLORS[status];
  const priorityStyle = PRIORITY_COLORS[priority];

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)]/70 overflow-hidden transition-all duration-200 hover:border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex gap-2 items-center shrink-0">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" />
          <span className="text-[13.5px] font-semibold text-[var(--foreground)]/85 truncate">
            {title}
          </span>
        </div>
        <div className="flex gap-2 items-center shrink-0 ml-3">
          <span
            className="px-4 py-1 rounded-xl text-[12px] font-mono font-semibold"
            style={{
              color: statusStyle.color,
              background: statusStyle.bg,
              borderColor: statusStyle.color + "30",
            }}
          >
            {status}
          </span>
          <span
            className="px-4 py-1 rounded-xl text-[12px] font-mono font-semibold"
            style={{
              color: priorityStyle.color,
              background: priorityStyle.bg,
            }}
          >
            {priority}
          </span>
          <ChevronDown
            size={13}
            className="text-[var(--muted-foreground)]/30 ml-0.5"
          />
        </div>
      </div>

      {isTable && (
        <div className="px-3 pb-3">
          <div className="bg-[var(--muted)]/20 border border-[var(--border)]/40 rounded-lg overflow-hidden">
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
                  className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--border)]/30 last:border-0 hover:bg-[var(--card)] transition-colors"
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
