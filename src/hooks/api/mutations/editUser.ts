import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type EditUserRequestParameters =
  operations["Users_Patch"]["parameters"]["path"];
type EditUserRequestBody =
  operations["Users_Patch"]["requestBody"]["content"]["application/json"];
type EditUserRequestResult =
  operations["Users_Patch"]["responses"]["200"]["content"]["application/json"];

export const useEditUser = ({ userId }: EditUserRequestParameters) => {
  const endpoint = "users";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    EditUserRequestResult,
    Error,
    EditUserRequestBody
  >({
    mutationFn: patch(getToken, `${endpoint}/${userId}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["registrationNumbers"],
      });
      queryClient.setQueryData([endpoint, userId], data);
    },
  });
  return { editUser: mutation.mutateAsync };
};
