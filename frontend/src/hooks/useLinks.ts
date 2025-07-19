import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useLinks = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["getlinks"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("http://localhost:5000/api/links", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      return res.links || [];
    },
    enabled: !!token,
  });
};
