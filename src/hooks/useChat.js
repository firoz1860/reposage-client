import { useCallback, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { formatErrorMessage } from "../utils/formatErrorMessage";

const getAuthHeaders = () => {
  const token = window.localStorage.getItem("reposage_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function useChat({ owner, repo }) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    const { data } = await axiosInstance.get(`/api/chat/history/${owner}/${repo}`);
    setMessages(data.messages);
    return data.messages;
  }, [owner, repo]);

  const clearHistory = useCallback(async () => {
    await axiosInstance.delete(`/api/chat/history/${owner}/${repo}`);
    setMessages([]);
  }, [owner, repo]);

  const sendMessage = useCallback(async (content) => {
    setError("");
    const userMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      sources: []
    };
    const outgoingHistory = [...messages, userMessage].map(({ role, content: body }) => ({
      role,
      content: body
    }));
    const assistantPlaceholder = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      sources: []
    };

    setMessages((current) => [...current, userMessage, assistantPlaceholder]);
    setIsStreaming(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chat/${owner}/${repo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            message: content,
            history: outgoingHistory
          })
        }
      );

      if (!response.ok || !response.body) {
        let message = "Unable to stream AI response.";

        try {
          const payload = await response.json();
          message = payload.message || message;
        } catch (_error) {
          // Ignore JSON parse failures and use the fallback message.
        }

        setMessages((current) => current.slice(0, -1));
        setError(formatErrorMessage(message));
        throw new Error(formatErrorMessage(message));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamedContent = "";

      const applyAssistantUpdate = (nextContent, sources = null) => {
        setMessages((current) => {
          const updated = [...current];
          const lastMessage = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...lastMessage,
            content: nextContent,
            sources: sources || lastMessage.sources || []
          };
          return updated;
        });
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const eventBlock of events) {
          const lines = eventBlock.split("\n");
          const event = lines.find((line) => line.startsWith("event:"))?.replace("event:", "").trim();
          const dataLine = lines.find((line) => line.startsWith("data:"));

          if (!dataLine) {
            continue;
          }

          const data = JSON.parse(dataLine.replace("data:", "").trim());

          if (event === "token") {
            streamedContent = `${streamedContent}${streamedContent ? " " : ""}${data.content}`;
            applyAssistantUpdate(streamedContent);
          }

          if (event === "done") {
            applyAssistantUpdate(data.answer, data.sources);
          }
        }
      }
    } catch (requestError) {
      setMessages((current) => current.slice(0, -1));
      setError(formatErrorMessage(requestError.message));
      throw requestError;
    } finally {
      setIsStreaming(false);
    }
  }, [messages, owner, repo]);

  return useMemo(
    () => ({
      messages,
      setMessages,
      isStreaming,
      error,
      loadHistory,
      clearHistory,
      sendMessage
    }),
    [clearHistory, error, isStreaming, loadHistory, messages, sendMessage]
  );
}
