function Toast({ message, variant = "info" }) {
  const palette = {
    info: "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#0b1120] dark:text-white",
    success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    error: "border-rose-400/30 bg-rose-400/10 text-rose-200"
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm shadow-lg ${palette[variant] || palette.info}`}>
      {message}
    </div>
  );
}

export default Toast;
