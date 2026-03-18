import { test, expect } from '../fixtures';
import { createRequestsResponse, createRequestsDay } from '../factories/requests';
import { createSummaryResponse } from '../factories/summary';

test.describe('Edit requests page', () => {
  test('displays heading', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await expect(page.getByRole('heading', { name: 'Edit Requests' })).toBeVisible();
  });

  test('displays checkboxes for each day in desktop table', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const table = page.locator('table');
    await expect(table.getByLabel(/Request parking for Mon 3 Mar/)).toBeVisible();
    await expect(table.getByLabel(/Request parking for Tue 4 Mar/)).toBeVisible();
  });

  test('checkboxes reflect initial request state', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const table = page.locator('table');
    await expect(table.getByLabel(/Request parking for Mon 3 Mar/)).toBeChecked();
    await expect(table.getByLabel(/Request parking for Tue 4 Mar/)).not.toBeChecked();
  });

  test('toggling a checkbox changes its state', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const table = page.locator('table');
    const checkbox = table.getByLabel(/Request parking for Tue 4 Mar/);
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('unchecking a checked checkbox works', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const table = page.locator('table');
    const checkbox = table.getByLabel(/Request parking for Mon 3 Mar/);
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('save navigates home with week parameter', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/\?week=0/);
  });

  test('cancel navigates home with week parameter', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/\/\?week=0/);
  });

  test('preserves week parameter from URL', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse({
      requests: {
        weeks: [
          {
            days: [
              createRequestsDay({ localDate: '2025-03-03', data: { requested: true } }),
              createRequestsDay({ localDate: '2025-03-04', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-05', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-06', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-07', data: { requested: false } }),
            ],
          },
          {
            days: [
              createRequestsDay({ localDate: '2025-03-10', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-11', data: { requested: true } }),
              createRequestsDay({ localDate: '2025-03-12', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-13', data: { requested: false } }),
              createRequestsDay({ localDate: '2025-03-14', data: { requested: false } }),
            ],
          },
        ],
      },
    });
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-requests?week=1');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/\?week=1/);
  });
});

test.describe('Edit requests page - mobile view', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows week navigation buttons', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await expect(page.getByRole('button', { name: 'Previous week' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next week' })).toBeVisible();
  });

  test('checkboxes have accessible labels in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await expect(page.getByRole('checkbox', { name: /Request parking for Mon 3 Mar/ })).toBeVisible();
  });

  test('toggling a checkbox works in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const checkbox = page.getByRole('checkbox', { name: /Request parking for Tue 4 Mar/ });
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('checkboxes reflect initial request state in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await expect(page.getByRole('checkbox', { name: /Request parking for Mon 3 Mar/ })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: /Request parking for Tue 4 Mar/ })).not.toBeChecked();
  });

  test('unchecking a checked checkbox works in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    const checkbox = page.getByRole('checkbox', { name: /Request parking for Mon 3 Mar/ });
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('save navigates home in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/\?week=0/);
  });

  test('cancel navigates home in mobile view', async ({ page, mockApi, applyMockApi }) => {
    mockApi.requests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-requests');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/\/\?week=0/);
  });
});
