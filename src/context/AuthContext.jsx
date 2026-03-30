import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "reposage_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authTransition, setAuthTransition] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromCallback = params.get("token");

    if (tokenFromCallback) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, tokenFromCallback);
      params.delete("token");
      const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
      setAuthTransition(null);
    }

    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(() => {
    if (authTransition) {
      return;
    }

    setAuthTransition("logging-in");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const origin = window.location.origin;
    window.setTimeout(() => {
      window.location.href = `${apiUrl}/auth/github?origin=${encodeURIComponent(origin)}`;
    }, 2500);
  }, [authTransition]);

  const logout = useCallback(async () => {
    if (authTransition) {
      return;
    }

    setAuthTransition("logging-out");
    window.setTimeout(async () => {
      try {
        await axiosInstance.post("/auth/logout");
      } catch (_error) {
        // Ignore logout request failures and clear client state regardless.
      } finally {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        setAuthTransition(null);
        window.location.assign("/");
      }
    }, 1800);
  }, [authTransition]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser: fetchCurrentUser,
      authTransition
    }),
    [authTransition, fetchCurrentUser, isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
