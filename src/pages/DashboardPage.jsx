import { Suspense, lazy, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/layout/Sidebar";
import RepoList from "../components/repo/RepoList";
import Toast from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";
import { useRepos } from "../hooks/useRepos";

const ParticleField = lazy(() => import("../components/3d/ParticleField"));

function DashboardPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { repos, isLoading, error } = useRepos();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRepos = useMemo(() => {
    const normalized = query.toLowerCase();

    return repos.filter((repo) => {
      const matchesQuery =
        repo.name.toLowerCase().includes(normalized) ||
        repo.owner.toLowerCase().includes(normalized) ||
        repo.description.toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "all" ||
        (filter === "indexed" && repo.indexStatus === "indexed") ||
        (filter === "not_indexed" && repo.indexStatus !== "indexed");

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, repos]);

  return (
    <div className="relative flex min-h-[calc(100vh-var(--app-header-height))]">
      <Suspense
        fallback={
          <div
            className={`pointer-events-none fixed inset-0 -z-10 animate-ambient-gradient ${
              isDark
                ? "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_35%),linear-gradient(180deg,rgba(3,7,18,0.35),rgba(3,7,18,1))]"
                : "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_35%),linear-gradient(180deg,rgba(248,250,252,0.7),rgba(248,250,252,1))]"
            }`}
          />
        }
      >
        <ParticleField />
      </Suspense>
      <Sidebar />
      <section className="mx-auto max-w-7xl flex-1 px-6 py-12">
        <div
          className={`rounded-3xl border p-8 ${
            isDark
              ? "border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(8,15,26,0.9))]"
              : "border-slate-200 bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(255,255,255,0.92))] shadow-sm"
          }`}
        >
          <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? "text-emerald-300" : "text-indigo-500"}`}>Repository Dashboard</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>Welcome back, {user?.username || "developer"}.</h1>
              <p className={`mt-3 max-w-2xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Search, index, and open a chat session against any repository your GitHub account can access.
              </p>
            </div>
            <div
              className={`flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3 ${
                isDark
                  ? "border-white/10 bg-[#050816]/80"
                  : "border-slate-200 bg-white/90 shadow-sm"
              }`}
            >
              <Search size={16} className="text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search repositories..."
                className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-500 ${isDark ? "text-white" : "text-slate-900"}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Connected as {user?.username}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {filteredRepos.length} repos visible
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["indexed", "Indexed"],
              ["not_indexed", "Not Indexed"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  filter === value
                    ? isDark
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : isDark
                      ? "border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-slate-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error ? <div className="mt-6"><Toast message={error} variant="error" /></div> : null}

        <div className="mt-8">
          <RepoList repos={filteredRepos} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
