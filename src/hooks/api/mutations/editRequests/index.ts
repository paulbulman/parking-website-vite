import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { patch } from "../../helpers";
import type {
  EditRequestsRequestBody,
  EditRequestsRequestResult,
} from "./types";

export const useEditRequests = () => {
  const endpoint = "requests";
  const queryClient = useQueryClient();
  const { getToken: getAuthToken } = useAuthContext();

  const mutation = useMutation<
    EditRequestsRequestResult,
    Error,
    EditRequestsRequestBody
  >({
    mutationFn: patch(getAuthToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
  const { mutateAsync: editRequests, isPending: isSaving } = mutation;
  return { editRequests, isSaving };
};
