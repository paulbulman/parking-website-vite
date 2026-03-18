import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useUsersList = () =>
  useApiQuery<ApiResponse<"UsersList_Get">>("usersList");
