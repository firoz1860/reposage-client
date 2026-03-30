import { motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const lines = [
  "> Clearing session...",
  "> Revoking access tokens...",
  "> Purging local cache...",
  "> Disconnecting from GitHub..."
];

function LogoutLoader() {
  const { user } = useAuth();
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const queue = [...lines, `> Goodbye, ${user?.username || "developer"}`];
    let lineIndex = 0;

    const intervalId = window.setInterval(() => {
      setVisibleLines(queue.slice(0, lineIndex + 1));
      lineIndex += 1;

      if (lineIndex >= queue.length) {
        window.clearInterval(intervalId);
      }
    }, 150);

    return () => window.clearInterval(intervalId);
  }, [user?.username]);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] overflow-hidden bg-black/95 px-6 py-12 text-[#00ff88]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
      <motion.div
        animate={reducedMotion ? {} : { x: [0, -8, 8, 0], filter: ["none", "drop-shadow(2px 0 red) drop-shadow(-2px 0 blue)", "none"] }}
        transition={{ delay: 1.4, duration: 0.2 }}
        className="relative mx-auto max-w-3xl font-['JetBrains_Mono'] text-sm"
      >
        {visibleLines.map((line) => (
          <p key={line} className="mb-3">
            {line}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default memo(LogoutLoader);
