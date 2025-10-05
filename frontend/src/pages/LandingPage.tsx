import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <Button className="p-7 text-md" onClick={handleSignIn}>
        Sign In with Google
      </Button>
    </div>
  );
}
