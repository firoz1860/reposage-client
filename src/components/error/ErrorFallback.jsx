import { motion, useReducedMotion } from "framer-motion";

function ErrorFallback({ error }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020711] px-6 text-white">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="w-full max-w-3xl rounded-3xl border border-emerald-400/20 bg-[#03111d]/90 p-8 shadow-2xl"
      >
        <p className="font-mono text-6xl font-bold tracking-[0.4em] text-[#00ff88]">500</p>
        <h1 className="mt-6 text-3xl font-semibold">RepoSage encountered an error</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          The current view failed unexpectedly. Reload the page or return to the dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Reload Page
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200"
          >
            Go to Dashboard
          </button>
        </div>

        {import.meta.env.DEV ? (
          <details className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
            <summary className="cursor-pointer text-white">Error details</summary>
            <pre className="mt-4 whitespace-pre-wrap break-words text-xs">{String(error?.stack || error)}</pre>
          </details>
        ) : null}
      </motion.div>
    </div>
  );
}

export default ErrorFallback;
