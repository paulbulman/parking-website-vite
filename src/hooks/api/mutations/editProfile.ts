import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type EditProfileRequestBody =
  operations["Profiles_Patch"]["requestBody"]["content"]["application/json"];
type EditProfileRequestResult =
  operations["Profiles_Patch"]["responses"]["200"]["content"]["application/json"];

export const useEditProfile = () => {
  const endpoint = "profiles";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    EditProfileRequestResult,
    Error,
    EditProfileRequestBody
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["registrationNumbers"],
      });
      queryClient.setQueryData([endpoint], data);
    },
  });
  const { mutateAsync: editProfile, isPending: isSaving } = mutation;
  return { editProfile, isSaving };
};
