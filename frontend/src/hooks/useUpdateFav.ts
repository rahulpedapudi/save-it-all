import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

interface UpdateFavVariables {
  linkId: string;
  tags: string[];
}

export const useUpdateFav = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    UpdateFavVariables,
    { previousLinks: any[]; queryKey: string[] }
  >({
    mutationFn: async ({ linkId }) => {
      const response = await fetch(`http://localhost:5000/api/fav/${linkId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
      return response.json();
    },
    onMutate: async ({ linkId, tags }) => {
      const queryKey = ["links", tags];
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousLinks = queryClient.getQueryData<any[]>(queryKey) ?? [];

      queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
        if (!old) return old;
        return old.map((link) =>
          link._id === linkId
            ? { ...link, is_favorite: !link.is_favorite }
            : link
        );
      });

      return { previousLinks, queryKey: queryKey as string[] };
    },
    onError: (err, variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(context.queryKey, context.previousLinks);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.tags] });
    },
  });
};
