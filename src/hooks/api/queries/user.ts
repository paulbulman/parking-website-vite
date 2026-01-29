import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type UserRequestParameters =
  operations["Users_GetById"]["parameters"]["path"];
type UserRequestResult =
  operations["Users_GetById"]["responses"]["200"]["content"]["application/json"];

export const useUser = ({ userId }: UserRequestParameters) => {
  const endpoint = "users";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint, userId],

    queryFn: () =>
      get<UserRequestResult>(getToken, `${endpoint}/${userId}`)
  });
};
