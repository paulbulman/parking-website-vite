import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type StayInterruptedRequestBody =
  operations["DailyDetails_Patch"]["requestBody"]["content"]["application/json"];
type StayInterruptedRequestResult =
  operations["DailyDetails_Patch"]["responses"]["200"]["content"]["application/json"];

export const useStayInterrupted = () => {
  const endpoint = "stayInterrupted";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    StayInterruptedRequestResult,
    Error,
    StayInterruptedRequestBody
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData(["dailyDetails"], data);
    },
  });
  const { mutateAsync: stayInterrupted, isPending: isSaving } = mutation;
  return { stayInterrupted, isSaving };
};
