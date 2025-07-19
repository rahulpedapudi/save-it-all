import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        // Token is invalid, clear it
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        return false;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setToken(null);
      setUser(null);
      localStorage.removeItem("auth_token");
      return false;
    }
  };

  const login = async () => {
    try {
      // Get the auth URL from backend
      const response = await fetch(
        "http://localhost:5000/api/auth/google/login"
      );
      const data = await response.json();

      if (data.auth_url) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url;
      } else {
        console.error("Failed to get auth URL");
      }
    } catch (error) {
      console.error("Error initiating login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");

    // Send message to extension to clear JWT
    window.postMessage({ type: "SIGN_OUT" }, "*");
  };

  // Handle auth callback from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");

    if (tokenParam) {
      setToken(tokenParam);
      localStorage.setItem("auth_token", tokenParam);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Verify the token immediately
      verifyToken();
    }
  }, []);

  // Verify token on mount and when token changes
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await verifyToken();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
