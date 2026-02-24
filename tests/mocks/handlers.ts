import type { Page } from '@playwright/test';
import type { components } from '../../src/hooks/api/types';

type SummaryResponse = components['schemas']['SummaryResponse'];
type SummaryStatus = components['schemas']['SummaryStatus'];

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
