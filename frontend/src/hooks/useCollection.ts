import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useCollections = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("http://localhost:5000/collections/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const results = await response.json();
      return results.collections || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });
};
