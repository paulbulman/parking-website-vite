import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useRequests = () =>
  useApiQuery<ApiResponse<"Requests_Get">>("requests");
