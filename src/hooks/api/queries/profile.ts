import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/AuthContext";
import { get } from "../helpers";
import type { operations } from "../types";

type ProfileRequestResult =
  operations["Profiles_Get"]["responses"]["200"]["content"]["application/json"];

export const useProfile = () => {
  const endpoint = "profiles";

  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: [endpoint],

    queryFn: () => get<ProfileRequestResult>(getToken, endpoint),
  });
};
