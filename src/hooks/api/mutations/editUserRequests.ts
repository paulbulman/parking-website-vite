import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type EditUserRequestsRequestParameters =
  operations["Requests_PatchById"]["parameters"]["path"];
type EditUserRequestsRequestBody =
  operations["Requests_PatchById"]["requestBody"]["content"]["application/json"];
type EditUserRequestsRequestResult =
  operations["Requests_PatchById"]["responses"]["200"]["content"]["application/json"];

export const useEditUserRequests = ({
  userId,
}: EditUserRequestsRequestParameters) => {
  const endpoint = "requests";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    EditUserRequestsRequestResult,
    Error,
    EditUserRequestsRequestBody
  >({
    mutationFn: patch(getToken, `${endpoint}/${userId}`),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint, userId], data);
    },
  });
  const { mutateAsync: editUserRequests, isPending: isSaving } = mutation;
  return { editUserRequests, isSaving };
};
