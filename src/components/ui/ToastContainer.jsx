import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import useToastStore from "../../store/toastStore";

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info
};

const toneClasses = {
  error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  warning: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  info: "border-sky-500/40 bg-sky-500/10 text-sky-100"
};

function ToastItem({ toast, onClose }) {
  const reducedMotion = useReducedMotion();
  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onClose(toast.id), toast.duration);
    return () => window.clearTimeout(timeoutId);
  }, [onClose, toast.duration, toast.id]);

  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { x: 100, opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { x: 100, opacity: 0 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
      className={`w-full rounded-2xl border-l-4 px-4 py-3 shadow-2xl backdrop-blur ${toneClasses[toast.type] || toneClasses.info}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
          {toast.errorCode ? <p className="mt-1 text-xs opacity-70">{toast.errorCode}</p> : null}
        </div>
        <button type="button" onClick={() => onClose(toast.id)} className="rounded-full p-1 opacity-70 transition hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function ToastContainer() {
  const reducedMotion = useReducedMotion();
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence initial={!reducedMotion}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
