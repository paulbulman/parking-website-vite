import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { UsersListRequestResult } from "./types";

export const useUsersList = () => {
  const endpoint = "usersList";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<UsersListRequestResult>(getToken, endpoint),
  });
};
