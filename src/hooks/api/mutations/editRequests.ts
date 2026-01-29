import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type EditRequestsRequestBody =
  operations["Requests_Patch"]["requestBody"]["content"]["application/json"];
type EditRequestsRequestResult =
  operations["Requests_Patch"]["responses"]["200"]["content"]["application/json"];

export const useEditRequests = () => {
  const endpoint = "requests";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    EditRequestsRequestResult,
    Error,
    EditRequestsRequestBody
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
  const { mutateAsync: editRequests, isPending: isSaving } = mutation;
  return { editRequests, isSaving };
};
