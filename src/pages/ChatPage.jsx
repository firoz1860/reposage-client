import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ChatInput from "../components/chat/ChatInput";
import ChatWindow from "../components/chat/ChatWindow";
import SourcePanel from "../components/chat/SourcePanel";
import Sidebar from "../components/layout/Sidebar";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import { useChat } from "../hooks/useChat";
import { formatDate } from "../utils/formatDate";

const SageAvatar = lazy(() => import("../components/3d/SageAvatar"));

function ChatPage() {
  const { owner, repo } = useParams();
  const { messages, isStreaming, error, loadHistory, clearHistory, sendMessage } = useChat({ owner, repo });
  const [repoDetails, setRepoDetails] = useState(null);
  const [pageError, setPageError] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [avatarState, setAvatarState] = useState("idle");

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data }] = await Promise.all([
          axiosInstance.get(`/api/repos/${owner}/${repo}`),
          loadHistory()
        ]);
        setRepoDetails(data.repo);
        setPageError("");
      } catch (requestError) {
        setPageError(requestError.response?.data?.message || "Failed to load chat context.");
      }
    };

    load();
  }, [owner, repo]);

  useEffect(() => {
    if (selectedSources.length) {
      setIsSourcePanelOpen(true);
    }
  }, [selectedSources]);

  useEffect(() => {
    if (isStreaming) {
      setAvatarState("thinking");
      return;
    }

    if (messages[messages.length - 1]?.role === "assistant") {
      setAvatarState("done");
      const timeoutId = window.setTimeout(() => setAvatarState("idle"), 700);
      return () => window.clearTimeout(timeoutId);
    }

    setAvatarState("idle");
  }, [isStreaming, messages]);

  return (
    <div className="flex h-[calc(100vh-var(--app-header-height))] overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <section className="hidden h-full w-80 shrink-0 overflow-y-auto border-r border-slate-200 bg-white/82 p-6 dark:border-white/10 dark:bg-[#050816] xl:block">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Repository</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            {owner}/{repo}
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{repoDetails?.description || "No description provided."}</p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-[120px] w-[120px] rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5" />}>
              <SageAvatar avatarState={avatarState} />
            </Suspense>
          </div>
          <div className="mt-6 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>Language: {repoDetails?.language || "Unknown"}</p>
            <p>Stars: {repoDetails?.stars ?? 0}</p>
            <p>Indexed: {repoDetails?.lastIndexedAt ? formatDate(repoDetails.lastIndexedAt) : "Not yet"}</p>
            <p>Files: {repoDetails?.fileCount ?? 0}</p>
            <p>Chunks: {repoDetails?.chunkCount ?? 0}</p>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">File Tree Summary</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {(repoDetails?.fileTree || []).slice(0, 18).map((path) => (
                <p key={path} className="truncate">
                  {path}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-500 dark:text-emerald-300">Chat With Code</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {owner}/{repo}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-transparent dark:text-slate-200"
            >
              Clear History
            </button>
          </div>

          {pageError ? (
            <div className="mt-4 shrink-0">
              <Toast message={pageError} variant="error" />
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 shrink-0">
              <Toast message={error} variant="error" />
            </div>
          ) : null}

          <div className="mt-4 min-h-0 flex-1">
            <ChatWindow messages={messages} isStreaming={isStreaming} onSelectSources={setSelectedSources} />
          </div>
          <div className="sticky bottom-0 z-20 mt-4 shrink-0 bg-[linear-gradient(180deg,rgba(248,250,252,0),rgba(248,250,252,0.92)_22%,rgba(248,250,252,1))] pt-3 dark:bg-[linear-gradient(180deg,rgba(3,7,18,0),rgba(3,7,18,0.92)_22%,rgba(3,7,18,1))]">
            <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
          </div>
        </section>

        <SourcePanel
          sources={selectedSources}
          isOpen={isSourcePanelOpen}
          onToggle={() => setIsSourcePanelOpen((current) => !current)}
        />
      </div>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear conversation history?"
        description="This removes the saved Q&A thread for the current repository."
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsClearModalOpen(false)}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              await clearHistory();
              setSelectedSources([]);
              setIsClearModalOpen(false);
            }}
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white"
          >
            Clear
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ChatPage;
