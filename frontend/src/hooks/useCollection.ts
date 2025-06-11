import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export const useCollections = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch("http://localhost:5000/collections/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} `,
        },
      });
      const results = await response.json();
      return results.collections || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
