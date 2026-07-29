import { useProjectStore } from "@/app/store/useProjectStore";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConnectBtn() {
  const { currentProject } = useProjectStore();
  const router = useRouter();

  return (
    <button
      className="flex items-center space-x-1.5 bg-[var(--primary)] text-[var(--primary-foreground)]
                          font-black px-4 py-2 rounded-lg text-xs shadow-sm hover:opacity-90 transition-opacity"
      onClick={() => {
        router.push(`/project/${currentProject?.id}/my-info`);
      }}
    >
      <span>연동하기</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );
}
