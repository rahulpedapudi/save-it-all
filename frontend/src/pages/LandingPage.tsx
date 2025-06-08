import { useState, useEffect } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// just a simple landing page

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  if (showSignIn) {
    return <RedirectToSignIn redirectUrl="/onboarding" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f6fa]">
      <h1 className="text-3xl font-bold mb-2">Welcome to Save It</h1>
      <p className="text-lg mb-6">
        Save and organize your important links easily.
      </p>
      <button
        className="px-8 py-3 text-base rounded-md border-none bg-blue-600 text-white cursor-pointer mt-6 hover:bg-blue-700 transition"
        onClick={() => setShowSignIn(true)}>
        Sign In
      </button>
    </div>
  );
}
