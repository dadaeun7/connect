import { useAppStore } from "@/app/store/useAppStore";
import { FigmaState } from "@/types/worklineApp";
import { useState } from "react";

export const useFigmaInput = (
  figmaFileUrl: string,
  getFigmaState: (url: string) => Promise<FigmaState>,
  setFigmaState: (s: FigmaState) => void,
) => {
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "Figma를 먼저 연동해주세요.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const { appList } = useAppStore();

  const handleCheck = async () => {
    if (!figmaFileUrl.trim()) return;

    if (!appList.includes("FIGMA")) {
      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
      }));
      return;
    }

    setLoading(true);
    try {
      // 💡 서버 액션 직접 호출!
      const result = await getFigmaState(figmaFileUrl);
      if (result) {
        setFigmaState(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    alertConfig,
    loading,
    handleCheck,
  };
};
