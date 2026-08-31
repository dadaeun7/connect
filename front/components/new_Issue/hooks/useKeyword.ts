import { useState, useEffect } from "react";
import { fetchKeyword } from "../api/issue";

interface UseKeywordResult {
  keyword: string;
  loading: boolean;
  error: Error | null;
}

export function useKeyword(projectId: string): UseKeywordResult {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await fetchKeyword(projectId);
        if (isMounted) setKeyword(data);
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { keyword, loading, error };
}