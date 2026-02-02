import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/useAuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type DailyDetailsRequestResult =
  operations["DailyDetails_Get"]["responses"]["200"]["content"]["application/json"];

export const useDailyDetails = () => {
  const endpoint = "dailyDetails";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<DailyDetailsRequestResult>(getToken, endpoint),
  });
};
