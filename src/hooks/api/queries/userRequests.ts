import { useApiQuery } from "../useApiQuery";
import type { ApiPathParams, ApiResponse } from "../apiTypes";

export const useUserRequests = ({ userId }: ApiPathParams<"Requests_GetById">) =>
  useApiQuery<ApiResponse<"Requests_GetById">>("requests", {
    queryKey: ["requests", userId],
    path: `requests/${userId}`,
    enabled: Boolean(userId),
  });
