import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

export const useAssignCollection = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      collectionId,
    }: {
      linkId: string | undefined;
      collectionId: string;
    }) => {
      if (!token) {
        throw new Error("No authentication token");
      }

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
