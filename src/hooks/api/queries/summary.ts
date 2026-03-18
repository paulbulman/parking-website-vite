import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useSummary = () =>
  useApiQuery<ApiResponse<"Summary_GetSummary">>("summary");
