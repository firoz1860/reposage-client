import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AuthTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    setIsRouting(true);
    const timeoutId = window.setTimeout(() => setIsRouting(false), 420);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          scaleX: isRouting ? 1 : 0,
          opacity: isRouting ? 1 : 0
        }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
        className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-[#00ff88]"
      />
      <AnimatePresence mode="wait" initial={!reducedMotion}>
        <motion.div
          key={location.pathname}
          initial={reducedMotion ? false : { x: 30, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { x: -30, opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default memo(AuthTransition);
