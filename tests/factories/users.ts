import type { components } from '../../src/hooks/api/types';

type UsersData = components['schemas']['UsersData'];
type MultipleUsersResponse = components['schemas']['MultipleUsersResponse'];
type SingleUserResponse = components['schemas']['SingleUserResponse'];
type UsersListUser = components['schemas']['UsersListUser'];
type UsersListResponse = components['schemas']['UsersListResponse'];

let userCounter = 0;

export function createUser(overrides?: Partial<UsersData>): UsersData {
  userCounter++;
  return {
    userId: `user-${userCounter}`,
    firstName: `First${userCounter}`,
    lastName: `Last${userCounter}`,
    registrationNumber: `AB${userCounter}2 CDE`,
    alternativeRegistrationNumber: null,
    commuteDistance: 10 + userCounter,
    ...overrides,
  };
}

export function createMultipleUsersResponse(
  overrides?: Partial<MultipleUsersResponse>,
): MultipleUsersResponse {
  const defaults: MultipleUsersResponse = {
    users: [
      createUser({ userId: 'user-1', firstName: 'Jane', lastName: 'Doe', registrationNumber: 'XY56 ZAB', commuteDistance: 12.5 }),
      createUser({ userId: 'user-2', firstName: 'John', lastName: 'Smith', registrationNumber: 'AB12 CDE', alternativeRegistrationNumber: 'FG34 HIJ', commuteDistance: 8.0 }),
    ],
  };

  return { ...defaults, ...overrides };
}

export function createSingleUserResponse(
  overrides?: Partial<SingleUserResponse>,
): SingleUserResponse {
  const defaults: SingleUserResponse = {
    user: createUser({
      userId: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      registrationNumber: 'XY56 ZAB',
      alternativeRegistrationNumber: null,
      commuteDistance: 12.5,
    }),
  };

  return { ...defaults, ...overrides };
}

export function createUsersListUser(
  overrides?: Partial<UsersListUser>,
): UsersListUser {
  userCounter++;
  return {
    userId: `user-${userCounter}`,
    name: `User ${userCounter}`,
    ...overrides,
  };
}

export function createUsersListResponse(
  overrides?: Partial<UsersListResponse>,
): UsersListResponse {
  const defaults: UsersListResponse = {
    users: [
      createUsersListUser({ userId: 'user-1', name: 'Jane Doe' }),
      createUsersListUser({ userId: 'user-2', name: 'John Smith' }),
    ],
  };

  return { ...defaults, ...overrides };
}
