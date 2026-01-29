import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type ReservationsRequestResult =
  operations["Reservations_Get"]["responses"]["200"]["content"]["application/json"];

export const useReservations = () => {
  const endpoint = "reservations";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],
    queryFn: () => get<ReservationsRequestResult>(getToken, endpoint),
  });
};
