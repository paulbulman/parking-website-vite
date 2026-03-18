import type { components } from '../../src/hooks/api/types';

type SummaryResponse = components['schemas']['SummaryResponse'];
type DayOfSummaryData = components['schemas']['DayOfSummaryData'];
type SummaryStatus = components['schemas']['SummaryStatus'];

export function createSummaryDay(
  overrides: Partial<DayOfSummaryData> & { localDate: string },
): DayOfSummaryData {
  return {
    hidden: false,
    data: { status: null, isProblem: false },
    ...overrides,
  };
}

export function createSummaryResponse(
  overrides?: Partial<SummaryResponse>,
): SummaryResponse {
  const defaults: SummaryResponse = {
    summary: {
      weeks: [
        {
          days: [
            createSummaryDay({ localDate: '2025-03-03', data: { status: 'allocated' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-04', data: { status: 'pending' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-05', data: { status: 'interrupted' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-06', data: { status: null, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-07', data: { status: 'allocated' as SummaryStatus, isProblem: true } }),
          ],
        },
        {
          days: [
            createSummaryDay({ localDate: '2025-03-10', data: { status: 'allocated' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-11', data: { status: 'pending' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-12', data: { status: 'allocated' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-13', data: { status: 'interrupted' as SummaryStatus, isProblem: false } }),
            createSummaryDay({ localDate: '2025-03-14', data: { status: null, isProblem: false } }),
          ],
        },
      ],
    },
  };

  return { ...defaults, ...overrides };
}
