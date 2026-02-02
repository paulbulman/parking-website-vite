import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { post } from "../helpers";
import type { operations } from "../types";

type AddUserRequestBody =
  operations["Users_Post"]["requestBody"]["content"]["application/json"];
type AddUserRequestResult =
  operations["Users_Post"]["responses"]["200"]["content"]["application/json"];

export const useAddUser = () => {
  const endpoint = "users";
  const queryClient = useQueryClient();
  const { getToken } = useAuthContext();
  const mutation = useMutation<AddUserRequestResult, Error, AddUserRequestBody>(
    {
      mutationFn: post(getToken, endpoint),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["registrationNumbers"],
        });
      },
    }
  );
  return { addUser: mutation.mutateAsync };
};
