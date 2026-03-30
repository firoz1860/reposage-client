const statusClasses = {
  indexed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  indexing: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  failed: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  not_indexed: "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
};

function Badge({ status, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClasses[status] || statusClasses.not_indexed}`}
    >
      {children || status.replaceAll("_", " ")}
    </span>
  );
}

export default Badge;
