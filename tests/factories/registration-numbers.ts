import type { components } from '../../src/hooks/api/types';

type RegistrationNumbersResponse = components['schemas']['RegistrationNumbersResponse'];

export function createRegistrationNumbersResponse(
  overrides?: Partial<RegistrationNumbersResponse>,
): RegistrationNumbersResponse {
  const defaults: RegistrationNumbersResponse = {
    registrationNumbers: [
      { registrationNumber: 'AB12 CDE', name: 'Jane Doe' },
      { registrationNumber: 'FG34 HIJ', name: 'John Smith' },
    ],
  };

  return { ...defaults, ...overrides };
}
