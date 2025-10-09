import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useLinks = (tags: string[] = [], page: number, limit: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["getlinks", tags, page],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const queryParams = tags
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join("&");

      const url = `http://localhost:5000/api/links?page=${page}&limit=${limit}${
        queryParams ? `&${queryParams}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      return res || [];
    },
    enabled: !!token,
  });
};
