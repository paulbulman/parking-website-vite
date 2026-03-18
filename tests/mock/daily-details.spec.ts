import { test, expect } from '../fixtures';
import { createDailyDetailsResponse, createDailyDetailsDay } from '../factories/daily-details';

test.describe('Daily details page', () => {
  test('shows date picker with URL date selected', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByLabel('Select Date')).toHaveValue('2025-03-03');
  });

  test('shows allocated users for selected date', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('heading', { name: /Allocated/ })).toBeVisible();
    await expect(page.getByText('Alice Smith')).toBeVisible();
  });

  test('shows interrupted users for selected date', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-04');

    await expect(page.getByRole('heading', { name: /Interrupted/ })).toBeVisible();
    await expect(page.getByText('Bob Jones')).toBeVisible();
  });

  test('shows pending users', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse({
      details: [
        createDailyDetailsDay({
          localDate: '2025-03-03',
          data: {
            allocatedUsers: [],
            interruptedUsers: [],
            pendingUsers: [{ name: 'Charlie Brown', isHighlighted: false }],
            stayInterruptedStatus: { isAllowed: false, isSet: false },
          },
        }),
      ],
    });
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('heading', { name: /Pending/ })).toBeVisible();
    await expect(page.getByText('Charlie Brown')).toBeVisible();
  });

  test('shows no requests message when day has no users', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse({
      details: [
        createDailyDetailsDay({
          localDate: '2025-03-03',
          data: {
            allocatedUsers: [],
            interruptedUsers: [],
            pendingUsers: [],
            stayInterruptedStatus: { isAllowed: false, isSet: false },
          },
        }),
      ],
    });
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByText('There are no requests for the selected date.')).toBeVisible();
  });

  test('user lists have accessible labels', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse({
      details: [
        createDailyDetailsDay({
          localDate: '2025-03-03',
          data: {
            allocatedUsers: [{ name: 'Alice', isHighlighted: false }],
            interruptedUsers: [{ name: 'Bob', isHighlighted: false }],
            pendingUsers: [{ name: 'Charlie', isHighlighted: false }],
            stayInterruptedStatus: { isAllowed: false, isSet: false },
          },
        }),
      ],
    });
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('list', { name: 'Allocated users' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Interrupted users' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Pending users' })).toBeVisible();
  });

  test('changing date shows different users', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByText('Alice Smith')).toBeVisible();

    await page.getByLabel('Select Date').fill('2025-03-04');

    await expect(page.getByText('Bob Jones')).toBeVisible();
    await expect(page.getByText('Alice Smith')).toBeHidden();
  });

  test('shows stay interrupted button when allowed', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse({
      details: [
        createDailyDetailsDay({
          localDate: '2025-03-03',
          data: {
            allocatedUsers: [{ name: 'Alice', isHighlighted: false }],
            interruptedUsers: [],
            pendingUsers: [],
            stayInterruptedStatus: { isAllowed: true, isSet: false },
          },
        }),
      ],
    });
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('button', { name: 'Stay interrupted' })).toBeVisible();
  });

  test('shows re-request space button when stay interrupted is set', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse({
      details: [
        createDailyDetailsDay({
          localDate: '2025-03-03',
          data: {
            allocatedUsers: [{ name: 'Alice', isHighlighted: false }],
            interruptedUsers: [],
            pendingUsers: [],
            stayInterruptedStatus: { isAllowed: true, isSet: true },
          },
        }),
      ],
    });
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('button', { name: 'Re-request space' })).toBeVisible();
  });

  test('does not show stay interrupted button when not allowed', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByRole('button', { name: 'Stay interrupted' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Re-request space' })).toBeHidden();
  });

  test('defaults to first available date when URL date not provided', async ({ page, mockApi, applyMockApi }) => {
    mockApi.dailyDetails = createDailyDetailsResponse();
    await applyMockApi();
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByLabel('Select Date')).toHaveValue('2025-03-03');
    await expect(page.getByText('Alice Smith')).toBeVisible();
  });
});
