import { GitBranch, Lock, Star } from "lucide-react";
import { memo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useIndexer } from "../../hooks/useIndexer";
import { formatDate } from "../../utils/formatDate";
import Badge from "../ui/Badge";
import Toast from "../ui/Toast";
import IndexButton from "./IndexButton";
import RepoCard3D from "./RepoCard3D";

function RepoCard({ repo }) {
  const { isDark } = useTheme();
  const [actionError, setActionError] = useState("");
  const { status, isIndexing, triggerIndex, deleteIndex, error } = useIndexer({
    owner: repo.owner,
    repo: repo.name,
    initialStatus: repo.indexStatus,
    initialError: repo.indexError
  });

  return (
    <RepoCard3D>
      <article
        className={`flex h-full min-h-[22rem] flex-col rounded-3xl border p-6 transition ${
          isDark
            ? "border-white/10 bg-[#09101d]/92"
            : "border-slate-200 bg-white/90 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`truncate text-lg font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>{repo.name}</h3>
              {repo.private ? <Lock size={14} className="shrink-0 text-slate-500" /> : null}
            </div>
            <p
              className={`mt-2 min-h-[3.75rem] text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {repo.description || "No description provided."}
            </p>
          </div>
          <div className="[transform:translateZ(4px)]">
            <Badge status={status}>{status.replaceAll("_", " ")}</Badge>
          </div>
        </div>

        <div className={`mt-5 flex flex-wrap gap-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <span className={`rounded-full border px-3 py-1 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
            {repo.language || "Unknown"}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
            <Star size={12} />
            {repo.stars}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
            <GitBranch size={12} />
            {repo.defaultBranch}
          </span>
        </div>

        {error || actionError ? (
          <div className="mt-4">
            <Toast message={actionError || error} variant="error" />
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="text-xs text-slate-500">
            Last updated {formatDate(repo.updatedAt)}
            {repo.lastIndexedAt ? ` | Indexed ${formatDate(repo.lastIndexedAt)}` : ""}
          </div>
          <IndexButton
            owner={repo.owner}
            repo={repo.name}
            status={status}
            isIndexing={isIndexing}
            triggerIndex={triggerIndex}
            deleteIndex={deleteIndex}
            onError={setActionError}
          />
        </div>
      </article>
    </RepoCard3D>
  );
}

export default memo(RepoCard);
