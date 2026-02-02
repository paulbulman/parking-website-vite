import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type UserRequestsRequestParameters =
  operations["Requests_GetById"]["parameters"]["path"];
type UserRequestsRequestResult =
  operations["Requests_GetById"]["responses"]["200"]["content"]["application/json"];

export const useUserRequests = ({ userId }: UserRequestsRequestParameters) => {
  const endpoint = "requests";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint, userId],
    queryFn: () => get<UserRequestsRequestResult>(getToken, `${endpoint}/${userId}`),
    enabled: Boolean(userId)
  });
};
