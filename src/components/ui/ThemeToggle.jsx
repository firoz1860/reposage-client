import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { createAnimationConfig } from "../../utils/performance";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative h-8 w-[56px] rounded-full border p-[3px] transition ${
        isDark
          ? "border-white/10 bg-[linear-gradient(135deg,#0d1117,#1a2a1a)]"
          : "border-slate-200 bg-[linear-gradient(135deg,#e0f2fe,#fef3c7)]"
      }`}
    >
      {isDark ? (
        <>
          <span className="absolute left-[12px] top-[10px] h-1 w-1 rounded-full bg-white/70" />
          <span className="absolute left-[20px] top-[8px] h-1 w-1 rounded-full bg-white/50" />
          <span className="absolute left-[30px] top-[14px] h-1 w-1 rounded-full bg-white/60" />
        </>
      ) : null}

      <motion.span
        layout
        transition={createAnimationConfig(reducedMotion, { type: "spring", stiffness: 500, damping: 30 })}
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white text-slate-900 shadow-lg"
        style={{ marginLeft: isDark ? 0 : 24 }}
      >
        {isDark ? (
          <Moon size={12} className="text-slate-900" />
        ) : (
          <motion.span
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "linear" }}
          >
            <Sun size={12} className="text-amber-500" />
          </motion.span>
        )}
      </motion.span>
    </button>
  );
}

export default ThemeToggle;
