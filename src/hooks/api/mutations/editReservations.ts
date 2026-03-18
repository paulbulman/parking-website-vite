import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { ApiRequestBody, ApiResponse } from "../apiTypes";

export const useEditReservations = () => {
  const endpoint = "reservations";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    ApiResponse<"Reservations_Patch">,
    Error,
    ApiRequestBody<"Reservations_Patch">
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
    },
    onError: (error) => {
      console.error("Failed to save reservations:", error);
    },
  });

  const { mutateAsync: editReservations, isPending: isSaving, isError } = mutation;

  return { editReservations, isSaving, isError };
};
