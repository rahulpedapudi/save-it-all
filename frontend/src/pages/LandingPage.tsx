import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = () => {
    login();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f6fa]">
      <h1 className="text-3xl font-bold mb-2">Welcome to Save It</h1>
      <p className="text-lg mb-6">
        Save and organize your important links easily.
      </p>
      <button
        className="px-8 py-3 text-base rounded-md border-none bg-blue-600 text-white cursor-pointer mt-6 hover:bg-blue-700 transition"
        onClick={handleSignIn}>
        Sign In with Google
      </button>
    </div>
  );
}
