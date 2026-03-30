import { Loader2, MessageSquare, RefreshCw, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { formatErrorMessage } from "../../utils/formatErrorMessage";

function IndexButton({
  owner,
  repo,
  status,
  isIndexing,
  triggerIndex,
  deleteIndex,
  onError
}) {
  const handleIndex = async (reindex = false) => {
    try {
      await triggerIndex({ reindex });
    } catch (error) {
      onError?.(formatErrorMessage(error.response?.data?.message || error.message));
    }
  };

  if (isIndexing) {
    return (
      <button type="button" disabled className="inline-flex items-center gap-2 rounded-xl bg-amber-400/10 px-4 py-2 text-sm text-amber-300">
        <Loader2 size={16} className="animate-spin" />
        Indexing...
      </button>
    );
  }

  if (status === "indexed") {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/chat/${owner}/${repo}`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
        >
          <MessageSquare size={16} />
          Chat Now
        </Link>
        <button
          type="button"
          onClick={() => handleIndex(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200"
        >
          <RefreshCw size={16} />
          Re-index
        </button>
        <button
          type="button"
          onClick={deleteIndex}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 px-4 py-2 text-sm text-rose-200"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => handleIndex(false)}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
    >
      <Search size={16} />
      Index Repo
    </button>
  );
}

export default IndexButton;
