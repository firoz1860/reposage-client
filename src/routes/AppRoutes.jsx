import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthTransition from "../components/auth/AuthTransition";
import PageWrapper from "../components/layout/PageWrapper";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

const ChatPage = lazy(() => import("../pages/ChatPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <PageWrapper>
      <AuthTransition>
        <Suspense
          fallback={
            <div className="flex min-h-[calc(100vh-var(--app-header-height))] items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:owner/:repo"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthTransition>
    </PageWrapper>
  );
}

export default AppRoutes;
