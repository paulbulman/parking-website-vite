import { useApiQuery } from "../useApiQuery";
import type { ApiResponse } from "../apiTypes";

export const useReservations = () =>
  useApiQuery<ApiResponse<"Reservations_Get">>("reservations");
