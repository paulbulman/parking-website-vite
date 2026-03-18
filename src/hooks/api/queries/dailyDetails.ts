import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useDailyDetails = () =>
  useApiQuery<ApiResponse<"DailyDetails_Get">>("dailyDetails");
