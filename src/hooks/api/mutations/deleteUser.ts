import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { httpDelete } from "../helpers";
import type { ApiPathParams } from "../apiTypes";

export const useDeleteUser = () => {
  const endpoint = "users";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    never,
    Error,
    ApiPathParams<"Users_Delete">
  >({
    mutationFn: ({ userId }) => httpDelete(getToken, `${endpoint}/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      queryClient.invalidateQueries({ queryKey: ["registrationNumbers"] });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
  });

  const { mutateAsync: deleteUser, isPending: isDeleting, isError } = mutation;

  return { deleteUser, isDeleting, isError };
};
