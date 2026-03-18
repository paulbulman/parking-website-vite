import type { components } from '../../src/hooks/api/types';

type RequestsResponse = components['schemas']['RequestsResponse'];
type DayOfRequestsData = components['schemas']['DayOfRequestsData'];

export function createRequestsDay(
  overrides: Partial<DayOfRequestsData> & { localDate: string },
): DayOfRequestsData {
  return {
    hidden: false,
    data: { requested: false },
    ...overrides,
  };
}

export function createRequestsResponse(
  overrides?: Partial<RequestsResponse>,
): RequestsResponse {
  const defaults: RequestsResponse = {
    requests: {
      weeks: [
        {
          days: [
            createRequestsDay({ localDate: '2025-03-03', data: { requested: true } }),
            createRequestsDay({ localDate: '2025-03-04', data: { requested: false } }),
            createRequestsDay({ localDate: '2025-03-05', data: { requested: true } }),
            createRequestsDay({ localDate: '2025-03-06', data: { requested: false } }),
            createRequestsDay({ localDate: '2025-03-07', data: { requested: false } }),
          ],
        },
      ],
    },
  };

  return { ...defaults, ...overrides };
}
