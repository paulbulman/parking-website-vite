import type { components } from '../../src/hooks/api/types';

type ReservationsResponse = components['schemas']['ReservationsResponse'];
type DayOfReservationsData = components['schemas']['DayOfReservationsData'];
type ReservationsUser = components['schemas']['ReservationsUser'];

let userCounter = 0;

export function createReservationsUser(
  overrides?: Partial<ReservationsUser>,
): ReservationsUser {
  userCounter++;
  return {
    userId: `user-${userCounter}`,
    name: `User ${userCounter}`,
    ...overrides,
  };
}

export function createReservationsDay(
  overrides: Partial<DayOfReservationsData> & { localDate: string },
): DayOfReservationsData {
  return {
    hidden: false,
    data: { userIds: [] },
    ...overrides,
  };
}

export function createReservationsResponse(
  overrides?: Partial<ReservationsResponse>,
): ReservationsResponse {
  const users = [
    createReservationsUser({ userId: 'user-1', name: 'Alice Smith' }),
    createReservationsUser({ userId: 'user-2', name: 'Bob Jones' }),
  ];

  const defaults: ReservationsResponse = {
    shortLeadTimeSpaces: 2,
    users,
    reservations: {
      weeks: [
        {
          days: [
            createReservationsDay({ localDate: '2025-03-03', data: { userIds: ['user-1', ''] } }),
            createReservationsDay({ localDate: '2025-03-04', data: { userIds: ['', ''] } }),
            createReservationsDay({ localDate: '2025-03-05', data: { userIds: ['user-2', 'user-1'] } }),
            createReservationsDay({ localDate: '2025-03-06', data: { userIds: ['', ''] } }),
            createReservationsDay({ localDate: '2025-03-07', data: { userIds: ['', ''] } }),
          ],
        },
      ],
    },
  };

  return { ...defaults, ...overrides };
}
