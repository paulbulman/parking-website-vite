import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { post } from "../helpers";
import type { ApiRequestBody, ApiResponse } from "../apiTypes";

export const useAddUser = () => {
  const endpoint = "users";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Users_Post">,
    Error,
    ApiRequestBody<"Users_Post">
  >({
    mutationFn: post(getToken, endpoint),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationNumbers"],
      });
    },
    onError: (error) => {
      console.error("Failed to add user:", error);
    },
  });

  const { mutateAsync: addUser, isPending: isSaving, isError } = mutation;

  return { addUser, isSaving, isError };
};
