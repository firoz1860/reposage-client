import { isLowEndDevice, prefersReducedMotion } from "./deviceCapabilities";

export const canRenderThree = () => !isLowEndDevice() && !prefersReducedMotion();

export const createAnimationConfig = (reducedMotion, config) =>
  reducedMotion ? { duration: 0 } : config;
