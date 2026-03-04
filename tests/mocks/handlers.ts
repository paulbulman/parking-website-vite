import type { Page } from '@playwright/test';
import type { components } from '../../src/hooks/api/types';

type SummaryResponse = components['schemas']['SummaryResponse'];
type SummaryStatus = components['schemas']['SummaryStatus'];
type ProfileResponse = components['schemas']['ProfileResponse'];
type DailyDetailsResponse = components['schemas']['DailyDetailsResponse'];
type SingleUserResponse = components['schemas']['SingleUserResponse'];

function summaryDay(
  localDate: string,
  status: SummaryStatus | null = null,
  isProblem = false,
): components['schemas']['DayOfSummaryData'] {
  return { localDate, hidden: false, data: { status, isProblem } };
}

export function buildSummaryResponse(): SummaryResponse {
  return {
    summary: {
      weeks: [
        {
          days: [
            summaryDay('2025-03-03', 'allocated'),
            summaryDay('2025-03-04', 'pending'),
            summaryDay('2025-03-05', 'interrupted'),
            summaryDay('2025-03-06', null),
            summaryDay('2025-03-07', 'allocated', true),
          ],
        },
        {
          days: [
            summaryDay('2025-03-10', 'allocated'),
            summaryDay('2025-03-11', 'pending'),
            summaryDay('2025-03-12', 'allocated'),
            summaryDay('2025-03-13', 'interrupted'),
            summaryDay('2025-03-14', null),
          ],
        },
      ],
    },
  };
}

export async function mockSummaryApi(page: Page, data?: SummaryResponse) {
  await page.route('**/summary', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data ?? buildSummaryResponse()),
    }),
  );
}

export async function mockUnauthorizedApi(page: Page, endpoint: string) {
  await page.route(`**/${endpoint}`, (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' }),
    }),
  );
}

export function buildProfileResponse(): ProfileResponse {
  return {
    profile: {
      registrationNumber: 'AB12 CDE',
      alternativeRegistrationNumber: 'FG34 HIJ',
      requestReminderEnabled: true,
      reservationReminderEnabled: false,
    },
  };
}

export async function mockProfileApi(page: Page, data?: ProfileResponse) {
  await page.route('**/profiles', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data ?? buildProfileResponse()),
    }),
  );
}

export function buildDailyDetailsResponse(): DailyDetailsResponse {
  return {
    details: [
      {
        localDate: '2025-03-03',
        hidden: false,
        data: {
          allocatedUsers: [{ name: 'Alice Smith', isHighlighted: false }],
          interruptedUsers: [],
          pendingUsers: [],
          stayInterruptedStatus: { isAllowed: false, isSet: false },
        },
      },
      {
        localDate: '2025-03-04',
        hidden: false,
        data: {
          allocatedUsers: [],
          interruptedUsers: [{ name: 'Bob Jones', isHighlighted: true }],
          pendingUsers: [],
          stayInterruptedStatus: { isAllowed: false, isSet: false },
        },
      },
    ],
  };
}

export async function mockDailyDetailsApi(page: Page, data?: DailyDetailsResponse) {
  await page.route('**/dailyDetails', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data ?? buildDailyDetailsResponse()),
    }),
  );
}

export function buildUserResponse(): SingleUserResponse {
  return {
    user: {
      userId: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      registrationNumber: 'XY56 ZAB',
      alternativeRegistrationNumber: null,
      commuteDistance: 12.5,
    },
  };
}

export async function mockUserApi(page: Page, data?: SingleUserResponse) {
  await page.route('**/users/*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data ?? buildUserResponse()),
    }),
  );
}
