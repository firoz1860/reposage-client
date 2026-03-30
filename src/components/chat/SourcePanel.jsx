import { FileCode2, PanelRightClose, PanelRightOpen } from "lucide-react";

function SourcePanel({ sources, isOpen, onToggle }) {
  const dedupedSources = Array.from(new Map(sources.map((source) => [source.filePath, source])).values());

  return (
    <aside
      className={`fixed bottom-4 right-4 z-30 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white/98 shadow-2xl backdrop-blur transition-all duration-300 xl:static xl:bottom-auto xl:right-auto xl:max-w-none xl:rounded-none xl:border-l xl:border-t-0 xl:bg-white xl:shadow-none dark:border-white/10 dark:bg-[#050816]/98 dark:xl:bg-[#050816] ${
        isOpen
          ? "left-4 max-h-[min(26rem,70vh)] p-4 xl:left-auto xl:max-h-none xl:w-80 xl:p-5"
          : "left-auto w-14 p-3"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
      >
        {isOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
      </button>

      {isOpen ? (
        <>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sources</p>
          <div className="mt-5 max-h-[calc(min(26rem,70vh)-4rem)] space-y-3 overflow-y-auto xl:max-h-none">
            {dedupedSources.length ? (
              dedupedSources.map((source) => (
                <div key={source.filePath} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start gap-3">
                    <FileCode2 size={16} className="mt-0.5 text-indigo-500 dark:text-emerald-300" />
                    <div>
                      <p className="break-all text-sm text-slate-900 dark:text-white">{source.filePath}</p>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-white p-3 text-xs leading-6 text-slate-600 dark:bg-[#0b1120] dark:text-slate-300">
                        <code className="whitespace-pre-wrap break-words">
                          {source.snippet || "No snippet available."}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No sources selected yet.</p>
            )}
          </div>
        </>
      ) : null}
    </aside>
  );
}

export default SourcePanel;
