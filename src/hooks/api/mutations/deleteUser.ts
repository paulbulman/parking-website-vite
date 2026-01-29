import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { httpDelete } from "../helpers";
import type { operations } from "../types";

type DeleteUserRequestParameters =
  operations["Users_Delete"]["parameters"]["path"];
type DeleteUserRequestResult =
  operations["Users_Delete"]["responses"]["204"];

export const useDeleteUser = () => {
  const endpoint = "users";
  const { getToken } = useAuthContext();

  const mutation = useMutation<
    DeleteUserRequestResult,
    Error,
    DeleteUserRequestParameters
  >({
    mutationFn: ({ userId }) => httpDelete(getToken, `${endpoint}/${userId}`),
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = mutation;

  return { deleteUser, isDeleting };
};
