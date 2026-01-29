import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type SummaryRequestResult =
  operations["Summary_GetSummary"]["responses"]["200"]["content"]["application/json"];

export const useSummary = () => {
  const endpoint = "summary";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<SummaryRequestResult>(getToken, endpoint),
  });
};
