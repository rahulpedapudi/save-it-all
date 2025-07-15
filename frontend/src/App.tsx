import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage.js";
import DetailPage from "./pages/DetailPage.js";
import Profile from "./pages/Profile.js";
import LandingPage from "./pages/LandingPage.js";
import LoadingSpinner from "./components/LoadingSpinner.js";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* public route */}
        <Route path="/onboarding" element={<LandingPage />} />
        <Route path="/auth/callback" element={<LandingPage />} />
        <Route path="/auth/error" element={<LandingPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:_id"
          element={
            <ProtectedRoute>
              <DetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}
