import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { formatErrorMessage } from "../utils/formatErrorMessage";

export function useIndexer({ owner, repo, initialStatus = "not_indexed", initialError = "" }) {
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(initialStatus === "indexed" ? 100 : 0);
  const [error, setError] = useState(
    initialStatus === "failed" ? formatErrorMessage(initialError) : ""
  );
  const intervalRef = useRef(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fetchStatus = async () => {
    const { data } = await axiosInstance.get(`/api/index/status/${owner}/${repo}`);
    setStatus(data.status);
    setProgress(data.status === "indexed" ? 100 : data.status === "indexing" ? 65 : 0);
    setError(
      data.status === "failed"
        ? formatErrorMessage(data.errorMessage || "Repository indexing failed.")
        : ""
    );

    if (data.status === "indexed" || data.status === "failed" || data.status === "not_indexed") {
      stopPolling();
    }

    return data;
  };

  const startPolling = () => {
    stopPolling();
    intervalRef.current = window.setInterval(() => {
      fetchStatus().catch(() => {
        stopPolling();
      });
    }, 3000);
  };

  const triggerIndex = async ({ reindex = false } = {}) => {
    setError("");
    await axiosInstance.post(`/api/index/${owner}/${repo}?reindex=${reindex}`);
    setStatus("indexing");
    setProgress(20);
    startPolling();
  };

  const deleteIndex = async () => {
    await axiosInstance.delete(`/api/index/${owner}/${repo}`);
    setStatus("not_indexed");
    setProgress(0);
    setError("");
    stopPolling();
  };

  useEffect(() => {
    if (initialStatus === "indexing") {
      startPolling();
    }

    return stopPolling;
  }, [owner, repo, initialStatus]);

  return {
    triggerIndex,
    deleteIndex,
    status,
    isIndexing: status === "indexing",
    progress,
    error
  };
}
