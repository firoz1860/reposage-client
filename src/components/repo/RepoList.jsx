import RepoCard from "./RepoCard";

function RepoList({ repos, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[22rem] animate-pulse rounded-3xl border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (!repos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/75 p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        No repositories matched your search.
      </div>
    );
  }

  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}

export default RepoList;
