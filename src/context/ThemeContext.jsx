import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "reposage-theme";

const getSystemTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(STORAGE_KEY) || getSystemTheme();
};

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === "dark"
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
