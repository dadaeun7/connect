import { useState } from "react";

interface UseCreateProjectProps {
  onCreateClick?: (projectName: string) => void;
}

export function useCreateProject({ onCreateClick }: UseCreateProjectProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleButtonClick = () => {
    if (!isFormOpen) {
      setIsFormOpen(true);
    } else {
      if (!projectName.trim()) {
        alert("프로젝트 이름을 입력해 주세요.");
        return;
      }
      if (onCreateClick) {
        onCreateClick(projectName.trim());
      }
    }
  };

  return {
    isFormOpen,
    projectName,
    setProjectName,
    handleButtonClick,
  };
}
