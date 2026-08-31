import { useProjectStore } from "@/app/store/useProjectStore";
import { inviteUserApi } from "../api/affiliation";
import { useState } from "react";

export function useInviteFormSection() {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const { currentProject } = useProjectStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const inviteSubmit = async () => {
    const trimmedEmail = email.trim();

    // 1. 빈 값 및 공백 검증
    if (!trimmedEmail) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    // 2. 이메일 형식 유효성 검증
    if (!emailRegex.test(trimmedEmail)) {
      alert("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
      return;
    }

    try {
      setLoading(true);

      if (!currentProject?.id) return;

      const result = await inviteUserApi(currentProject?.id, email, role);

      if (!result.ok) {
        const errorData = await result.json().catch(() => null);
        const errorMessage =
          errorData?.body?.detail || "요청 처리에 실패했습니다.";

        setAlertConfig((props) => ({
          ...props,
          isOpen: true,
          type: "error",
          message: errorMessage,
        }));
        return;
      }

      setAlertConfig((props) => ({
        ...props,
        isOpen: true,
        type: "success",
        message: "초대 메일 발송완료!",
      }));
      setEmail("");
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    alertConfig,
    email,
    setEmail,
    role,
    setRole,
    inviteSubmit,
  };
}
