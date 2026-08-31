import { useState } from "react";
import { authenticate } from "../api/auth";

export function useAuth(mode: string) {
  const [formFirInput, setformFirInput] = useState("");
  const [formSecInput, setformSecInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProps, setLoadingProps] = useState({
    icon: "connect",
    describe: "연결중입니다...",
  });

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "인증 시간이 만료되었습니다.",
    type: "error" as "success" | "error" | "info",
    onClose: () => {
      setAlertConfig((props) => ({ ...props, isOpen: false }));
    },
  });

  const resPopHandler = (t: "success" | "error" | "info", message?: string) => {
    setAlertConfig((props) => ({
      ...props,
      type: t,
      isOpen: true,
      message: message || "관리자에게 문의해주세요.",
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      setLoadingProps((props) => ({
        ...props,
        icon: "mail",
        describe: "가입 메일 발송중입니다...",
      }));
    }

    setLoading(true);

    try {
      const jsonBody = await authenticate(mode, formFirInput, formSecInput);

      if (jsonBody.registration) {
        resPopHandler("success", jsonBody.registration);
        return;
      }

      if (jsonBody.loginIn) {
        resPopHandler("success", "로그인 성공했습니다.");
        window.location.href = "/";
        return;
      }

      if (jsonBody.message) {
        setAlertConfig((props) => ({
          ...props,
          type: "error",
          isOpen: true,
          message: jsonBody.message ? jsonBody.message : "",
        }));
        return;
      }

      throw new Error(
        "올바르지 않은 접근이거나 유효하지 않은 응답 형태입니다.",
      );
    } catch (error: any) {
      console.error("Error:", error);
      resPopHandler("error", error.message);
    } finally {
      setformFirInput("");
      setformSecInput("");
      setLoading(false);
    }
  };

  return {
    formFirInput,
    setformFirInput,
    formSecInput,
    setformSecInput,
    loading,
    loadingProps,
    alertConfig,
    handleSubmit,
    setLoading, // ExternalUp에서 필요하므로 노출
  };
}
