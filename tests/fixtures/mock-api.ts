import type { Page, Route } from '@playwright/test';
import type { components } from '../../src/hooks/api/types';

type SummaryResponse = components['schemas']['SummaryResponse'];
type ProfileResponse = components['schemas']['ProfileResponse'];
type DailyDetailsResponse = components['schemas']['DailyDetailsResponse'];
type RequestsResponse = components['schemas']['RequestsResponse'];
type ReservationsResponse = components['schemas']['ReservationsResponse'];
type MultipleUsersResponse = components['schemas']['MultipleUsersResponse'];
type SingleUserResponse = components['schemas']['SingleUserResponse'];
type UsersListResponse = components['schemas']['UsersListResponse'];
type RegistrationNumbersResponse = components['schemas']['RegistrationNumbersResponse'];

export interface MockApiState {
  summary: SummaryResponse | null;
  profile: ProfileResponse | null;
  dailyDetails: DailyDetailsResponse | null;
  requests: RequestsResponse | null;
  userRequests: RequestsResponse | null;
  reservations: ReservationsResponse | null;
  users: MultipleUsersResponse | null;
  user: SingleUserResponse | null;
  usersList: UsersListResponse | null;
  registrationNumbers: RegistrationNumbersResponse | null;
}

export function createMockApiState(): MockApiState {
  return {
    summary: null,
    profile: null,
    dailyDetails: null,
    requests: null,
    userRequests: null,
    reservations: null,
    users: null,
    user: null,
    usersList: null,
    registrationNumbers: null,
  };
}

function json(route: Route, data: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  });
}

function isApiRequest(route: Route): boolean {
  return route.request().resourceType() === 'fetch' ||
    route.request().resourceType() === 'xhr';
}

export async function setupMockApi(page: Page, state: MockApiState) {
  if (state.summary) {
    await page.route('**/summary', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.summary);
    });
  }

  if (state.profile) {
    await page.route('**/profiles', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.profile);
    });
  }

  if (state.dailyDetails) {
    await page.route('**/dailyDetails', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.dailyDetails);
    });
  }

  if (state.requests) {
    await page.route('**/requests', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.requests);
    });
  }

  if (state.userRequests) {
    await page.route('**/requests/*', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.userRequests);
    });
  }

  if (state.reservations) {
    await page.route('**/reservations', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.reservations);
    });
  }

  if (state.users) {
    await page.route('**/users', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      if (route.request().method() === 'GET') {
        return json(route, state.users);
      }
      return json(route, {
        user: {
          userId: 'new-user',
          firstName: '',
          lastName: '',
          registrationNumber: null,
          alternativeRegistrationNumber: null,
          commuteDistance: null,
        },
      });
    });
  }

  if (state.user) {
    await page.route('**/users/*', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      if (route.request().method() === 'GET') {
        return json(route, state.user);
      }
      if (route.request().method() === 'DELETE') {
        return route.fulfill({ status: 204 });
      }
      return json(route, state.user);
    });
  }

  if (state.usersList) {
    await page.route('**/usersList', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.usersList);
    });
  }

  if (state.registrationNumbers) {
    await page.route('**/registrationNumbers/*', (route) => {
      if (!isApiRequest(route)) return route.fallback();
      return json(route, state.registrationNumbers);
    });
  }

  // StayInterrupted PATCH
  await page.route('**/stayInterrupted', (route) => {
    if (!isApiRequest(route)) return route.fallback();
    return json(route, state.dailyDetails ?? { details: [] });
  });
}
