import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/useAuthContext";
import { get } from "./helpers";

interface ApiQueryOptions {
  queryKey?: unknown[];
  path?: string;
  enabled?: boolean;
}

export function useApiQuery<T>(
  endpoint: string,
  options?: ApiQueryOptions,
) {
  const { getToken } = useAuthContext();

  return useQuery({
    queryKey: options?.queryKey ?? [endpoint],
    queryFn: () => get<T>(getToken, options?.path ?? endpoint),
    enabled: options?.enabled,
  });
}
