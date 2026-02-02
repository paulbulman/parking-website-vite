import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { patch } from "../helpers";
import type { operations } from "../types";

type EditReservationsRequestBody =
  operations["Reservations_Patch"]["requestBody"]["content"]["application/json"];
type EditReservationsRequestResult =
  operations["Reservations_Patch"]["responses"]["200"]["content"]["application/json"];

export const useEditReservations = () => {
  const endpoint = "reservations";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    EditReservationsRequestResult,
    Error,
    EditReservationsRequestBody
  >({
    mutationFn: patch(getToken, endpoint),
    onSuccess: (data) => {
      queryClient.setQueryData([endpoint], data);
    },
  });
  const { mutateAsync: editReservations, isPending: isSaving } = mutation;
  return { editReservations, isSaving };
};
