import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type RequestsRequestResult =
  operations["Requests_Get"]["responses"]["200"]["content"]["application/json"];

export const useRequests = () => {
  const endpoint = "requests";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<RequestsRequestResult>(getToken, endpoint),
  });
};
