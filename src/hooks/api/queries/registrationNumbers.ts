import { useApiQuery } from "../useApiQuery";
import type { ApiPathParams, ApiResponse } from "../apiTypes";

export const useRegistrationNumbers = ({
  searchString,
}: ApiPathParams<"RegistrationNumbers_Get">) => {
  const sanitizedSearchString = searchString.replace(/[^a-z0-9]/gi, "");

  return useApiQuery<ApiResponse<"RegistrationNumbers_Get">>(
    "registrationNumbers",
    {
      queryKey: ["registrationNumbers", sanitizedSearchString],
      path: `registrationNumbers/${sanitizedSearchString}`,
      enabled: Boolean(sanitizedSearchString),
    }
  );
};
