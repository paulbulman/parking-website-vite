import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiRequestBody, ApiResponse } from "../apiTypes";

export const useStayInterrupted = () => {
  const endpoint = "stayInterrupted";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"DailyDetails_Patch">,
    Error,
    ApiRequestBody<"DailyDetails_Patch">
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData(["dailyDetails"], data);
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    },
  });

  const { mutateAsync: stayInterrupted, isPending: isSaving, isError } = mutation;

  return { stayInterrupted, isSaving, isError };
};
