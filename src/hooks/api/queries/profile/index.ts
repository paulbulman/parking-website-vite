import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { get } from "../../helpers";
import type { ProfileRequestResult } from "./types";

export const useProfile = () => {
  const endpoint = "profiles";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<ProfileRequestResult>(getToken, endpoint),
  });
};
