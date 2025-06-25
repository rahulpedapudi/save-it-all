import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export const useLinks = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["getlinks"],
    queryFn: async () => {
      const token = await getToken();
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
  });
};
