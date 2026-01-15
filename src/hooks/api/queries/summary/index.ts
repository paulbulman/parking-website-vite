import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { SummaryRequestResult } from "./types";

export const useSummary = () => {
  const endpoint = "summary";

  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () =>
      get<SummaryRequestResult>(getAuthToken, endpoint)
  });
};
