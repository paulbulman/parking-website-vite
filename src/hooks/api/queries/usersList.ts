import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type UsersListRequestResult =
  operations["UsersList_Get"]["responses"]["200"]["content"]["application/json"];

export const useUsersList = () => {
  const endpoint = "usersList";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<UsersListRequestResult>(getToken, endpoint),
  });
};
