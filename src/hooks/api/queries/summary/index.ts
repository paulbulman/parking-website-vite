import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { SummaryRequestResult } from "./types";

export const useSummary = () => {
  const endpoint = "summary";

  const { getToken: getAuthToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<SummaryRequestResult>(getAuthToken, endpoint),
  });
};
