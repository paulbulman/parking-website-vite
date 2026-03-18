import { useApiQuery } from "../useApiQuery";
import type { ApiPathParams, ApiResponse } from "../apiTypes";

export const useUser = ({ userId }: ApiPathParams<"Users_GetById">) =>
  useApiQuery<ApiResponse<"Users_GetById">>("users", {
    queryKey: ["users", userId],
    path: `users/${userId}`,
  });
