import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { RequestsRequestResult } from "./types";

export const useRequests = () => {
  const endpoint = "requests";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<RequestsRequestResult>(getToken, endpoint),
  });
};
