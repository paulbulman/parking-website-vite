import type { components } from '../../src/hooks/api/types';

type ProfileResponse = components['schemas']['ProfileResponse'];

export function createProfileResponse(
  overrides?: Partial<ProfileResponse>,
): ProfileResponse {
  const defaults: ProfileResponse = {
    profile: {
      registrationNumber: 'AB12 CDE',
      alternativeRegistrationNumber: 'FG34 HIJ',
      requestReminderEnabled: true,
      reservationReminderEnabled: false,
    },
  };

  return { ...defaults, ...overrides };
}
