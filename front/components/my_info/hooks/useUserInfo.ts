import { useState, useEffect } from "react";
import { updateUserInfo, withdrawUser } from "../api/user";
import { useUserInfoStore } from "@/app/store/useUserInfoStore";
import { useConfirmation } from "@/components/share/ConfirmationContext";
import { userWithDraw } from "@/actions/myinfo";

export function useUserInfo() {
  const { userInfo } = useUserInfoStore();
  const [name, setName] = useState<string>("");
  const [isUpdating, setUpdating] = useState(false);
  const { openConfirm } = useConfirmation();
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  useEffect(() => {
    if (userInfo?.name) {
      setName(userInfo.name);
    }
  }, [userInfo]);

  const handleUpdateName = async () => {
    if (!name || name === userInfo?.name) return null;

    setUpdating(true);
    try {
      await updateUserInfo(name);
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const withDrawHandle = async () => {
    openConfirm({
      message: "탈퇴 진행 정보는 복구할 수 없습니다. 회원 탈퇴 하시겠습니까?",
      onConfirm: async () => {
        try {
          await withdrawUser(userWithDraw);
          setAlertConfig({
            isOpen: true,
            message: "성공적으로 회원 탈퇴 되었습니다.",
            type: "success",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } catch (error: any) {
          setAlertConfig({
            isOpen: true,
            message: error.message || "탈퇴 처리 중 오류가 발생했습니다.",
            type: "error",
          });
        }
      },
      onCancel: () => {},
    });
  };

  const onUpdateName = async () => {
    try {
      const result = await handleUpdateName();
      if (result?.success) {
        setAlertConfig({
          isOpen: true,
          message: "성공적으로 변경되었습니다.",
          type: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        message: error.message || "변경 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  return {
    userInfo,
    name,
    setName,
    handleUpdateName,
    isUpdating: isUpdating,
    alertConfig,
    setAlertConfig,
    withDrawHandle,
    onUpdateName,
  };
}
