import { Routes, Route, Navigate } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import HomePage from "./pages/HomePage.js";
import DetailPage from "./pages/DetailPage.js";
import Profile from "./pages/Profile.js";
import LandingPage from "./pages/LandingPage.js";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* public route */}
        <Route path="/onboarding" element={<LandingPage />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <HomePage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/onboarding" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/detail/:_id"
          element={
            <>
              <SignedIn>
                <DetailPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/onboarding" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/onboarding" />
              </SignedOut>
            </>
          }></Route>
      </Routes>
    </QueryClientProvider>
  );
}
