import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { ReservationsRequestResult } from "./types";

export const useReservations = () => {
  const endpoint = "reservations";

  const { getAuthToken } = useAuth();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<ReservationsRequestResult>(getAuthToken, endpoint),
  });
};
