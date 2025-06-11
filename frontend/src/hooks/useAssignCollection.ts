import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export const useAssignCollection = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      collectionId,
    }: {
      linkId: string | undefined;
      collectionId: string;
    }) => {
      const token = await getToken();
      const assign = await fetch(
        `http://localhost:5000/api/link/${linkId}/assign-folder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ folder_id: collectionId }),
        }
      );
      return assign.ok;
    },
  });
};
