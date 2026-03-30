import { motion, useReducedMotion } from "framer-motion";

function RepoCard3D({ children }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-slate-200/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:border-white/12" />
      <div className="pointer-events-none absolute inset-[1px] rounded-3xl bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_52%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_52%)]" />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export default RepoCard3D;
