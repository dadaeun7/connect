"use client";
// ConfirmationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmationOptions {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationContextType {
  openConfirm: (options: ConfirmationOptions) => void;
  closeConfirm: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined,
);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const openConfirm = (newOptions: ConfirmationOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    if (options?.onCancel) {
      options.onCancel();
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (options?.onConfirm) {
      options.onConfirm();
    }
  };

  return (
    <ConfirmationContext.Provider value={{ openConfirm, closeConfirm }}>
      {children}

      {isOpen && options && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <p style={messageStyle}>{options.message}</p>
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleConfirm}
                style={confirmButtonStyle}
              >
                진행
              </button>
              <button
                type="button"
                onClick={closeConfirm}
                style={cancelButtonStyle}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider",
    );
  }
  return context;
};

// 기본 인라인 스타일 (CSS-in-JS 혹은 CSS module/Tailwind 등으로 대체 가능)
export const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

export const modalBoxStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  textAlign: "center",
  minWidth: "300px",
};
const messageStyle: React.CSSProperties = {
  whiteSpace: "pre-line",
  marginBottom: "24px",
  color: "#333",
};
const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};
const confirmButtonStyle: React.CSSProperties = {
  padding: "8px 24px",
  backgroundColor: "#1d1e1f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const cancelButtonStyle: React.CSSProperties = {
  padding: "8px 24px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
