import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useUsers = () =>
  useApiQuery<ApiResponse<"Users_Get">>("users");
