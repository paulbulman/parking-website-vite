import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiPathParams, ApiRequestBody, ApiResponse } from "../apiTypes";

export const useEditUserRequests = ({
  userId,
}: ApiPathParams<"Requests_PatchById">) => {
  const endpoint = "requests";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Requests_PatchById">,
    Error,
    ApiRequestBody<"Requests_PatchById">
  >({
    mutationFn: patch(getToken, `${endpoint}/${userId}`),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint, userId], data);
    },
    onError: (error) => {
      console.error("Failed to save requests:", error);
    },
  });

  const { mutateAsync: editUserRequests, isPending: isSaving, isError } = mutation;

  return { editUserRequests, isSaving, isError };
};
