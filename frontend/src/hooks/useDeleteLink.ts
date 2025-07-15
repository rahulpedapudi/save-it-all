import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useDeleteLink = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const res = await fetch(`http://localhost:5000/api/links/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getlinks"] });
    },
  });
};
