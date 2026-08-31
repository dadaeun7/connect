import { useProjectStore } from "@/app/store/useProjectStore";
import { useEffect, useState } from "react";
import { getKeyword } from "../api/issue";
import { MenuKey } from "../types/issueType";

const filteredIssues = ["전체", "OPEN", "MERGE"];

export const useMAinIssue = () => {
  const [keyword, setKeyword] = useState("");
  const [already, setAlready] = useState(false);
  const { currentProject } = useProjectStore();
  const [curStateMenu, setCurStateMenu] = useState<MenuKey>("전체");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    if (!currentProject?.id) return;
    const handleGetKeyword = async () => {
      try {
        const data = await getKeyword(currentProject?.id);
        setKeyword(data);
        setAlready(true);
      } catch (error) {
        console.error(error);
      }
    };
    handleGetKeyword();
  }, []);

  return {
    currentProject,
    filteredIssues,
    keyword,
    setKeyword,
    already,
    setAlready,
    curStateMenu,
    setCurStateMenu,
    searchKeyword,
    setSearchKeyword,
  };
};
