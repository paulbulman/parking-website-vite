import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useProfile = () =>
  useApiQuery<ApiResponse<"Profiles_Get">>("profiles");
