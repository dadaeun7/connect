import { useState } from "react";

interface UseActiveTabOptions {
  initialTab: "general" | "integration";
}

export function useActiveTab({ initialTab }: UseActiveTabOptions) {
  const [activeTab, setActiveTab] = useState<"general" | "integration">(
    initialTab,
  );

  return { activeTab, setActiveTab };
}