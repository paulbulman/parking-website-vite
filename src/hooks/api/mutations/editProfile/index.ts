import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { patch } from "../../helpers";
import type { EditProfileRequestBody, EditProfileRequestResult } from "./types";

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
