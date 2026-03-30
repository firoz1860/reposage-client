import axios from "axios";
import useToastStore from "../store/toastStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: false,
  timeout: 30000
});

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("reposage_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error.response?.data?.errorCode;
    const status = error.response?.status;

    const userMessages = {
      AUTH_FAILED: "Your session has expired. Please log in again.",
      TOKEN_EXPIRED: "Your session has expired. Please log in again.",
      REPO_NOT_INDEXED: "This repo needs to be indexed before you can chat.",
      ALREADY_INDEXING: "This repo is already being indexed. Please wait.",
      RATE_LIMIT_EXCEEDED: "Too many requests. Please wait a moment.",
      GITHUB_API_ERROR: "GitHub is unavailable. Please try again shortly.",
      GEMINI_ERROR: "Gemini AI service is temporarily unavailable.",
      CHROMA_UNAVAILABLE: "Vector search is temporarily unavailable."
    };

    const message =
      userMessages[errorCode] ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (status === 401) {
      window.localStorage.removeItem("reposage_token");
      window.location.href = "/";
      return Promise.reject(error);
    }

    useToastStore.getState().addToast({
      type: "error",
      message,
      errorCode
    });

    return Promise.reject({
      ...error,
      userMessage: message
    });
  }
);

export default axiosInstance;
