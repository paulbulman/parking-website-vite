import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiRequestBody, ApiResponse } from "../apiTypes";

export const useEditRequests = () => {
  const endpoint = "requests";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Requests_Patch">,
    Error,
    ApiRequestBody<"Requests_Patch">
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error("Failed to save requests:", error);
    },
  });

  const { mutateAsync: editRequests, isPending: isSaving, isError } = mutation;

  return { editRequests, isSaving, isError };
};
