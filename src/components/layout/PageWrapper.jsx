import Navbar from "./Navbar";
import { useTheme } from "../../context/ThemeContext";

function PageWrapper({ children }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors [--app-header-height:96px] ${
        isDark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-950"
      }`}
    >
      <Navbar />
      <main className="min-h-[calc(100vh-var(--app-header-height))]">{children}</main>
    </div>
  );
}

export default PageWrapper;
