import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiRequestBody, ApiResponse } from "../apiTypes";

export const useEditProfile = () => {
  const endpoint = "profiles";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Profiles_Patch">,
    Error,
    ApiRequestBody<"Profiles_Patch">
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["registrationNumbers"],
      });
      queryClient.setQueryData([endpoint], data);
    },
    onError: (error) => {
      console.error("Failed to save profile:", error);
    },
  });

  const { mutateAsync: editProfile, isPending: isSaving, isError } = mutation;

  return { editProfile, isSaving, isError };
};
