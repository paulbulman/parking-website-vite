import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../../contexts/AuthContext";
import { patch } from "../../helpers";
import type {
  EditReservationsRequestBody,
  EditReservationsRequestResult,
} from "./types";

export const useEditReservations = () => {
  const endpoint = "reservations";
  const queryClient = useQueryClient();
  const { getAuthToken } = useAuth();

  const mutation = useMutation<
    EditReservationsRequestResult,
    Error,
    EditReservationsRequestBody
  >({
    mutationFn: patch(getAuthToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
    },
  });
  const { mutateAsync: editReservations, isPending: isSaving } = mutation;
  return { editReservations, isSaving };
};
