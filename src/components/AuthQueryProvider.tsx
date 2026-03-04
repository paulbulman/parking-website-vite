import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useAuthContext } from "../contexts/useAuthContext";
import { ApiError } from "../hooks/api/helpers";

function handleError(error: Error, logout: () => void) {
  if (error instanceof ApiError && error.status === 401) {
    logout();
  }
}

export function AuthQueryProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuthContext();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => handleError(error, logout),
        }),
        mutationCache: new MutationCache({
          onError: (error) => handleError(error, logout),
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
