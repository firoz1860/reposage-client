import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function useRepos() {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/repos");
      setRepos(data.repos);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load repositories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return {
    repos,
    isLoading,
    error,
    refetch: fetchRepos
  };
}

