import { Suspense, lazy } from "react";
import ToastContainer from "./components/ui/ToastContainer";
import { RepoProvider } from "./context/RepoContext";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";

const LoginLoader = lazy(() => import("./components/auth/LoginLoader"));
const LogoutLoader = lazy(() => import("./components/auth/LogoutLoader"));

function App() {
  const { authTransition } = useAuth();
  const { isDark, theme } = useTheme();

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen`} data-theme={theme}>
      <ToastContainer />
      <RepoProvider>
        <AppRoutes />
      </RepoProvider>
      <Suspense fallback={null}>
        {authTransition === "logging-in" ? <LoginLoader /> : null}
        {authTransition === "logging-out" ? <LogoutLoader /> : null}
      </Suspense>
    </div>
  );
}

export default App;
