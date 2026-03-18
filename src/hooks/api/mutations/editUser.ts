import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiPathParams, ApiRequestBody, ApiResponse } from "../apiTypes";

export const useEditUser = ({ userId }: ApiPathParams<"Users_Patch">) => {
  const endpoint = "users";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Users_Patch">,
    Error,
    ApiRequestBody<"Users_Patch">
  >({
    mutationFn: patch(getToken, `${endpoint}/${userId}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["registrationNumbers"],
      });
      queryClient.setQueryData([endpoint, userId], data);
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });

  const { mutateAsync: editUser, isPending: isSaving, isError } = mutation;

  return { editUser, isSaving, isError };
};
