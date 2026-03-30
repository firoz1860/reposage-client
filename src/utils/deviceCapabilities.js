export const isLowEndDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = navigator.deviceMemory ?? 8;

  return cores <= 4 || memory <= 4;
};

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
