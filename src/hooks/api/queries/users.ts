import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type UsersRequestResult =
  operations["Users_Get"]["responses"]["200"]["content"]["application/json"];

export const useUsers = () => {
  const endpoint = "users";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<UsersRequestResult>(getToken, endpoint),
  });
};
