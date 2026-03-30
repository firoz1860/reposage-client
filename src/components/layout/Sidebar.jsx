import { LayoutDashboard, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Chat", to: "/dashboard", icon: MessageSquare }
];

function Sidebar() {
  const location = useLocation();
  const { isDark } = useTheme();
  const items = navItems.map((item) =>
    item.label === "Chat"
      ? {
          ...item,
          to: location.pathname.startsWith("/chat/") ? location.pathname : "/dashboard"
        }
      : item
  );

  return (
    <aside
      className={`hidden w-64 shrink-0 border-r p-5 backdrop-blur lg:block ${
        isDark ? "border-white/10 bg-[#050816]/70" : "border-slate-200 bg-white/75"
      }`}
    >
      <p className="mb-4 text-xs uppercase tracking-[0.32em] text-slate-500">Workspace</p>
      <nav className="space-y-2">
        {items.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                active
                  ? isDark
                    ? "border border-emerald-400/30 bg-emerald-400/10 text-white"
                    : "border border-indigo-200 bg-indigo-50 text-slate-950"
                  : isDark
                    ? "border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    : "border border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
