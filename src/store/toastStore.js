import { create } from "zustand";

const MAX_VISIBLE_TOASTS = 3;

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const nextToast = {
      id: Date.now() + Math.random(),
      duration: toast.duration || 4000,
      type: toast.type || "info",
      ...toast
    };

    const current = get().toasts;
    const next = current.length >= MAX_VISIBLE_TOASTS ? [...current.slice(1), nextToast] : [...current, nextToast];
    set({ toasts: next });
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    })),
  clearToasts: () => set({ toasts: [] })
}));

export default useToastStore;
