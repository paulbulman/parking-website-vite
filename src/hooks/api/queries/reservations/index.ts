import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { ReservationsRequestResult } from "./types";

export const useReservations = () => {
  const endpoint = "reservations";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<ReservationsRequestResult>(getToken, endpoint),
  });
};
