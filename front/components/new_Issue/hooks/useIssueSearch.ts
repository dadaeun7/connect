import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store/useAppStore";
import { useProjectStore } from "@/app/store/useProjectStore";
import { useConfirmation } from "@/components/share/ConfirmationContext";
import { createKeywordApi } from "../api/issue";

interface UseIssueSearchProps {
  keyword: string;
  setKeyword: (val: string) => void;
  already: boolean;
  setAlready: (val: boolean) => void;
}

export const useIssueSearch = ({
  keyword,
  setKeyword,
  already,
  setAlready,
}: UseIssueSearchProps) => {
  const { appList } = useAppStore();
  const router = useRouter();
  const { openConfirm, closeConfirm } = useConfirmation();
  const { currentProject } = useProjectStore();

  const [showImage, setShowImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "정상적으로 등록되었습니다. 공개 채널을 통해 이슈를 등록하세요",
    type: "success" as "success" | "error" | "info",
    onClose: () => setAlertConfig((prev) => ({ ...prev, isOpen: false })),
  });

  const handleClose = () => {
    setIsModalOpen(false);
    if (!already) {
      setKeyword("");
    }
  };

  const handleSubmit = async () => {
    if (!keyword.trim()) return;

    try {
      await createKeywordApi(keyword);
      setAlertConfig((prev) => ({ ...prev, isOpen: true }));
      setAlready(true);
    } catch (error) {
      console.error("Keyword creation failed:", error);
    } finally {
      handleClose();
      closeConfirm();
    }
  };

  const registryKeyword = () => {
    if (!appList.includes("SLACK")) {
      openConfirm({
        message:
          currentProject?.myRole === "ADMIN"
            ? "슬랙 연동전입니다. 내 정보 > OAuth 연동에서 연동해주세요."
            : "슬랙 연동전입니다. 관리자에게 문의하세요.",
        onConfirm: () => {
          if (currentProject?.myRole === "ADMIN") {
            router.push(`/project/${currentProject?.id}/my-info`);
          }
        },
        onCancel: () => {},
      });
      return;
    }
    setIsModalOpen(true);
  };

  const updateKeyword = () => {
    openConfirm({
      message:
        "키워드는 하나만 등록가능합니다. 기존 키워드로는 더 이상 이슈를 받을 수 없습니다.",
      onConfirm: handleSubmit,
      onCancel: () => {},
    });
  };

  return {
    currentProject,
    showImage,
    setShowImage,
    isModalOpen,
    setIsModalOpen,
    alertConfig,
    handleClose,
    handleSubmit,
    registryKeyword,
    updateKeyword,
  };
};
