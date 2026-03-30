import { Github, LogOut, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.svg";
import ThemeToggle from "../ui/ThemeToggle";

function Navbar() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { isDark } = useTheme();

  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-6">
      <div
        className={`relative mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden rounded-[28px] border px-5 py-4 backdrop-blur-xl sm:px-6 ${
          isDark
            ? "border-white/10 bg-[#050816]/88 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.85)]"
            : "border-slate-200 bg-white/88 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.28)]"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-10 top-0 h-px ${
            isDark
              ? "bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.55),transparent)]"
              : "bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.45),transparent)]"
          }`}
        />

        <div className="flex min-w-0 items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                isDark
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : "border-indigo-200 bg-indigo-50"
              }`}
            >
              <img src={logo} alt="RepoSage" className="h-8 w-8 rounded-xl" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs uppercase tracking-[0.38em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                RepoSage
              </p>
              <p className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                Ask your codebase anything
              </p>
            </div>
          </Link>

          <div
            className={`hidden items-center gap-2 rounded-full border px-3 py-2 lg:inline-flex ${
              isDark
                ? "border-white/10 bg-white/5 text-emerald-300"
                : "border-slate-200 bg-slate-50 text-indigo-600"
            }`}
          >
            <Sparkles size={14} />
            <span className="text-xs font-medium tracking-[0.25em] uppercase">Workspace Live</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{user.username}</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Connected with GitHub</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                  isDark
                    ? "border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/30 hover:text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-slate-950"
                }`}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={login}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <Github size={16} />
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
