import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { httpDelete } from "../../helpers";
import type { DeleteUserRequestParameters, DeleteUserRequestResult } from "./types";

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
