import type { components } from '../../src/hooks/api/types';

type DailyDetailsResponse = components['schemas']['DailyDetailsResponse'];
type DayOfDailyDetailsData = components['schemas']['DayOfDailyDetailsData'];

export function createDailyDetailsDay(
  overrides: Partial<DayOfDailyDetailsData> & { localDate: string },
): DayOfDailyDetailsData {
  return {
    hidden: false,
    data: {
      allocatedUsers: [],
      interruptedUsers: [],
      pendingUsers: [],
      stayInterruptedStatus: { isAllowed: false, isSet: false },
    },
    ...overrides,
  };
}

export function createDailyDetailsResponse(
  overrides?: Partial<DailyDetailsResponse>,
): DailyDetailsResponse {
  const defaults: DailyDetailsResponse = {
    details: [
      createDailyDetailsDay({
        localDate: '2025-03-03',
        data: {
          allocatedUsers: [{ name: 'Alice Smith', isHighlighted: false }],
          interruptedUsers: [],
          pendingUsers: [],
          stayInterruptedStatus: { isAllowed: false, isSet: false },
        },
      }),
      createDailyDetailsDay({
        localDate: '2025-03-04',
        data: {
          allocatedUsers: [],
          interruptedUsers: [{ name: 'Bob Jones', isHighlighted: true }],
          pendingUsers: [],
          stayInterruptedStatus: { isAllowed: false, isSet: false },
        },
      }),
    ],
  };

  return { ...defaults, ...overrides };
}
